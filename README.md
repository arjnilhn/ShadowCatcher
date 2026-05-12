# 🔦 Shadow Catcher

**Shadow Catcher** is a browser-based 2D top-down exploration and survival game developed as a Computer Graphics Final Project for Spring 2026.

The game is built with **p5.js** and **JavaScript**. It features real-time lighting effects, dynamic alpha masking, and advanced color filtering mechanics to challenge the player's spatial awareness.

### 🎮 Live Demo
[https://arjnilhn.github.io/ShadowCatcher/](https://arjnilhn.github.io/ShadowCatcher/)

### 📂 Repository
[https://github.com/arjnilhn/ShadowCatcher](https://github.com/arjnilhn/ShadowCatcher)

---

## 📝 Project Overview

Shadow Catcher challenges players to navigate through total darkness using only a limited flashlight. The goal is to collect light orbs to increase the score while avoiding hidden obstacles and navigating through increasingly complex levels.

**The game includes:**
* Start screen with interactive buttons
* Real-time "Flashlight" lighting system
* Dynamic level progression (Level 1 to 4)
* Objective-based gameplay (Orb collection)
* Game Over and Victory states
* **Special Level 4 Mechanic:** Subtractive Color Filtering (Magenta Filter)

---

## 🕹️ Game Mechanics & Levels

| Stage | Feature |
| :--- | :--- |
| **Level 1** | Basic movement and orb collection mechanics. |
| **Level 2** | Introduction of static obstacles and increased darkness. |
| **Level 3** | Complex maze navigation with tighter flashlight radius. |
| **Level 4** | **Magenta Filter:** Advanced optical illusion level where objects change identity based on light color. |

---

## 📜 Game Rules

* Players move a character through a darkened environment.
* The flashlight follows the **Mouse Position**, illuminating only a small radius.
* Collecting **White Orbs** increases the score and allows progression to the next level.
* Colliding with wall boundaries or hidden obstacles resets the current level.
* In **Level 4**, the player must use the "Magenta Filter" logic to reveal hidden path elements.

---

## ⌨️ Controls

| Control | Action |
| :--- | :--- |
| **WASD / Arrow Keys** | Character Movement |
| **Mouse Move** | Aim Flashlight / Change Illumination Direction |
| **Left Mouse Click** | Start Game / Navigate Menus |

---

## 💻 Computer Graphics Concepts

This project demonstrates several advanced computer graphics concepts:

* **Real-time Rendering:** Using the p5.js draw loop for high-performance 2D rendering.
* **Alpha Masking:** Implementing a flashlight effect by using `createGraphics()` and `erase()` functions to manipulate the alpha channel.
* **Subtractive Color Filtering:** Advanced level design using "Magenta Filter" logic to manage object visibility based on RGB values.
* **Collision Detection:** Implementing circle-to-rectangle and circle-to-circle Euclidean distance algorithms.
* **State Management:** Professional game flow control (Start -> Playing -> Game Over) using custom state variables.

---

