import React, { useState, useEffect } from "react";
// import { fetchData } from "../utils/fetchData";
import axios from "axios";

export default function Body() {
  const [apiData, setApiData] = useState([]);

  useEffect(() => {
    fetchDataApi();
  }, []);

  const fetchDataApi = async () => {
    try {
      const { data } = await axios.get(
        "https://pokeapi.co/api/v2/pokemon?limit=10"
      );
      const { results } = data;
      const updatedResults = await updateResults(results);

      setApiData(updatedResults);
    } catch (err) {
      console.log(err);
    }
  };

  const updateResults = async (results) => {
    const updatedResults = await Promise.all(
      results.map(async (src) => {
        const { data: urlData } = await axios.get(src.url);
        src.image = urlData.sprites.front_default;
        src.clicked = false;
        return src;
      })
    );

    return updatedResults;
  };

  const shuffleArray = () => {
    const shuffledArr = [...apiData];
    for (let i = shuffledArr.length - 1; i >= 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArr[i], shuffledArr[j]] = [shuffledArr[j], shuffledArr[i]];
    }
    setApiData(shuffledArr);
  };

  const markItem = (pokemon) => {
    pokemon.clicked = true;
  };

  const clickHandler = (pokemon) => {
    if (!pokemon.clicked) {
      markItem(pokemon);
      shuffleArray();
    } else {
      console.log("ai apasat deja pe el");
    }
  };

  return apiData ? (
    apiData.map((pokemonData) => {
      return (
        <div
          key={pokemonData.name}
          className="p-2 m-2"
          onClick={() => clickHandler(pokemonData)}
        >
          <p>
            {pokemonData.name.charAt(0).toUpperCase() +
              pokemonData.name.slice(1)}
          </p>
          <img src={pokemonData.image}></img>
        </div>
      );
    })
  ) : (
    <div>
      <p className="p-20 text-center">Fetching data...</p>
    </div>
  );
}
