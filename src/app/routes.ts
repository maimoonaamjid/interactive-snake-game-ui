import { createBrowserRouter } from "react-router";
import { Splash } from "./screens/Splash";
import { MainMenu } from "./screens/MainMenu";
import { DifficultySelection } from "./screens/DifficultySelection";
import { Gameplay } from "./screens/Gameplay";
import { GameOver } from "./screens/GameOver";
import { HighScore } from "./screens/HighScore";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Splash,
  },
  {
    path: "/menu",
    Component: MainMenu,
  },
  {
    path: "/difficulty",
    Component: DifficultySelection,
  },
  {
    path: "/play",
    Component: Gameplay,
  },
  {
    path: "/game-over",
    Component: GameOver,
  },
  {
    path: "/high-score",
    Component: HighScore,
  },
]);