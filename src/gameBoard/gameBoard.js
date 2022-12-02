import React, { useEffect } from "react";
import "./gameBoard.css";

let gameState = {
  roundNum: 0,
  pattern: [],
  userClicked: []
};

function timeout(delay: number) {
  return new Promise((res) => setTimeout(res, delay));
}

export const GameBoard = () => {
  const quadrantIds = [
    {
      id: "upper-left",
      audio:
        "https://sampleswap.org/samples-ghost/DRUMS%20(FULL%20KITS)/LO%20FI%20and%208%20BIT%20KITS/CASIO%20SK-1/8[kb]SK1_MT.wav.mp3"
    },
    {
      id: "upper-right",
      audio:
        "https://sampleswap.org/samples-ghost/DRUMS%20(FULL%20KITS)/LO%20FI%20and%208%20BIT%20KITS/CASIO%20SK-1/8[kb]SK1_HT.wav.mp3"
    },
    {
      id: "lower-left",
      audio:
        "https://sampleswap.org/samples-ghost/DRUMS%20(FULL%20KITS)/LO%20FI%20and%208%20BIT%20KITS/CASIO%20SK-1/9[kb]SK1_LT.wav.mp3"
    },
    {
      id: "lower-right",
      audio:
        "https://sampleswap.org/samples-ghost/DRUMS%20(FULL%20KITS)/LO%20FI%20and%208%20BIT%20KITS/Mattel%20Synso/32[kb]mattel-tom07.wav.mp3"
    }
  ];

  const getRandomQuadrant = () => {
    const randomNum = Math.floor(Math.random() * 4);
    return quadrantIds[randomNum].id;
  };

  async function playPattern() {
    for (let i in gameState.pattern) {
      const patternId = gameState.pattern[i];
      flashQuadrant(patternId);
      await timeout(1500);
    }
  }

  async function flashQuadrant(patternId) {
    document.getElementById(patternId).style = "filter: saturate(5);";
    const audio = document.getElementById(patternId + "-audio");
    audio.play();
    await timeout(1000);
    document.getElementById(patternId).style.removeProperty("filter");
  }

  const progressGame = () => {
    gameState.roundNum += 1;
    gameState.userClicked = [];
    document.getElementById("count").innerHTML = gameState.roundNum;
    gameState.pattern.push(getRandomQuadrant());
    playPattern();
  };

  const stopGame = () => {
    gameState = {
      roundNum: 0,
      pattern: [],
      userClicked: []
    };
    document.getElementById("count").innerHTML = "- -";
  };

  // button on each quadrant to validate if user has clicked pattern yet
  async function validate(e) {
    if (gameState.roundNum > 0) {
      const clickedId = e.target.id;
      const nextIndexNum = gameState.userClicked.length;
      const nextIndexId = gameState.pattern[nextIndexNum];
      flashQuadrant(clickedId);

      if (clickedId === nextIndexId) {
        gameState.userClicked.push(clickedId);
      } else {
        stopGame();
      }

      if (
        gameState.userClicked.length === gameState.pattern.length &&
        gameState.roundNum > 0
      ) {
        await timeout(2000);
        progressGame();
      }
    }
  }

  return (
    <div id="board">
      <div id="quadrants">
        {quadrantIds.map((x) => {
          return (
            <div className="quadrant" id={x.id} onClick={validate}>
              <audio id={x.id + "-audio"} src={x.audio} />
            </div>
          );
        })}
      </div>
      <div id="middle">
        <h1>Simon</h1>
        <div id="controls">
          <div id="count" className="control">
            - -
          </div>
          <div id="start" className="control" onClick={progressGame}></div>
          <div id="stop" className="control" onClick={stopGame}></div>
        </div>
      </div>
    </div>
  );
};
