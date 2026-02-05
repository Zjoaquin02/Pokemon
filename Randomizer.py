from flask import Flask, render_template, request
import requests
import random

app = Flask(__name__)

# -----------------------------
# Funciones
# -----------------------------

def describir_condiciones(detalle):
    condiciones = []

    if detalle.get("min_level"):
        condiciones.append(f"Nivel {detalle['min_level']}")

    if detalle.get("item"):
        condiciones.append(
            f"Usando {detalle['item']['name'].replace('-', ' ').title()}"
        )

    if detalle.get("trigger", {}).get("name") == "trade":
        condiciones.append("Intercambio")

    if detalle.get("min_happiness"):
        condiciones.append("Alta felicidad")

    if detalle.get("time_of_day"):
        condiciones.append(
            f"De {detalle['time_of_day']}"
        )

    if detalle.get("known_move"):
        condiciones.append(
            f"Sabiendo {detalle['known_move']['name'].replace('-', ' ').title()}"
        )

    if detalle.get("location"):
        condiciones.append(
            f"En {detalle['location']['name'].replace('-', ' ').title()}"
        )

    if detalle.get("held_item"):
        condiciones.append(
            f"Sosteniendo {detalle['held_item']['name'].replace('-', ' ').title()}"
        )

    return condiciones


def tiene_mega(especie):
    for variedad in especie.get("varieties", []):
        nombre = variedad["pokemon"]["name"]
        if "mega" in nombre:
            return True
    return False


def es_pokemon_paradoja(nombre, generacion):
    nombre = nombre.lower()

    if generacion.lower() != "generation ix":
        return False

    palabras_paradoja = [
        "great", "brute", "scream", "flutter", "slither",
        "sandy", "roaring", "walking",
        "iron"
    ]

    return any(p in nombre for p in palabras_paradoja)

PARADOJAS_BASE = {
    "great tusk": "donphan",
    "iron treads": "donphan",
    "scream tail": "jigglypuff",
    "flutter mane": "misdreavus",
    "brute bonnet": "amoonguss",
    "iron bundle": "delibird",
    "iron valiant": "gallade / gardevoir",
}


LEGENDARY_IDS = [
    144, 145, 146, 150,  # Gen 1
    243, 244, 245, 249, 250,  # Gen 2
    377, 378, 379, 380, 381, 382, 383, 384,  # Gen 3
    480, 481, 482, 483, 484, 485, 486, 487, 488,  # Gen 4
    638, 639, 640, 641, 642, 643, 644, 645, 646,  # Gen 5
    716, 717, 718,  # Gen 6
    785, 786, 787, 788, 789, 790, 791, 792, 800,  # Gen 7
    888, 889, 890, 891, 892, 898,  # Gen 8
    1001, 1002, 1003, 1004, 1007, 1008  # Gen 9
]

def obtener_pokemon_aleatorio(solo_legendarios=False):
    if solo_legendarios:
        return random.choice(LEGENDARY_IDS)
    return random.randint(1, 1010)

def obtener_datos_pokemon(pokemon_id):
    url = f"https://pokeapi.co/api/v2/pokemon/{pokemon_id}"
    return requests.get(url).json()

def obtener_especie(url):
    return requests.get(url).json()

def obtener_cadena_evolutiva(url):
    return requests.get(url).json()

def recorrer_evoluciones(chain, lista, previo=None):
    actual = chain["species"]["name"]

    if previo:
        detalle = chain["evolution_details"][0] if chain["evolution_details"] else {}
        condiciones = describir_condiciones(detalle)

        lista.append({
            "from": previo,
            "to": actual,
            "condiciones": condiciones
        })

    for evo in chain["evolves_to"]:
        recorrer_evoluciones(evo, lista, actual)


# -----------------------------
# Ruta principal
# -----------------------------

@app.route("/")
def index():
    # Si no hay parámetro "started", mostramos bienvenida
    if not request.args.get("started"):
        return render_template("index.html", welcome_mode=True)

    legendary_filter = request.args.get("legendary")  # "1" o None
    pokemon_id = obtener_pokemon_aleatorio(solo_legendarios=(legendary_filter == "1"))
    pokemon = obtener_datos_pokemon(pokemon_id)

    nombre = pokemon["name"].capitalize()
    tipos = [t["type"]["name"] for t in pokemon["types"]]
    imagen_url = pokemon["sprites"]["other"]["official-artwork"]["front_default"]
    altura = pokemon["height"] / 10   # metros
    peso = pokemon["weight"] / 10     # kg


    especie = obtener_especie(pokemon["species"]["url"])
    generacion = especie["generation"]["name"].replace("-", " ").capitalize()
    gen_raw = especie["generation"]["name"]   # "generation-vi"
    gen_romano = gen_raw.split("-")[1].upper()
    generacion = gen_romano
    mega_disponible = tiene_mega(especie)
    es_legendario = especie.get("is_legendary", False)
    es_paradoja = es_pokemon_paradoja(nombre, generacion)

    pokemon_base = None
    if es_paradoja:
        pokemon_base = PARADOJAS_BASE.get(nombre.lower())


    cadena = obtener_cadena_evolutiva(especie["evolution_chain"]["url"])
    evoluciones = []
    recorrer_evoluciones(cadena["chain"], evoluciones)
    
    evoluciones_por_origen = {}
    for evo in evoluciones:
        origen = evo["from"]
        evoluciones_por_origen.setdefault(origen, []).append(evo)

    return render_template(
        "index.html",
        welcome_mode=False,  # No es bienvenida, es contenido
        nombre=nombre,
        tipos=tipos,
        imagen_url=imagen_url,
        generacion=generacion,
        evoluciones_por_origen=evoluciones_por_origen,
        es_paradoja=es_paradoja,
        pokemon_base=pokemon_base,
        mega_disponible=mega_disponible,
        es_legendario=es_legendario,
        altura=altura,
        peso=peso,
        legendary_filter=legendary_filter
    )

import os

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
