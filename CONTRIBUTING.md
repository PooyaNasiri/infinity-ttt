# Contributing to Pooya Nasiri's Portfolio

First off, thanks for taking the time to contribute! 🎉

This is a personal portfolio website, so while I welcome bug fixes, performance improvements, and typos, I generally **do not accept** major design changes or content updates that change the personal nature of the site.

## How to Contribute

1.  **Fork the repository** to your own GitHub account.
2.  **Clone the project** to your machine.
3.  **Create a branch** locally with a succinct name.
    ```bash
    git checkout -b fix/typo-in-about-section
    ```
4.  **Commit changes** to the branch.
5.  **Push changes** to your fork.
6.  **Open a Pull Request** in this repository.

## Development

If you are running the project locally, remember that you need a local server (like Python's `http.server` or VS Code Live Server) to load the 3D models properly due to CORS restrictions.

## Style Guide

* Please follow the existing CSS naming conventions (BEM-ish).
* Ensure the 3D assets (Three.js) load efficiently.
* Do not break the dark/light mode toggle.
