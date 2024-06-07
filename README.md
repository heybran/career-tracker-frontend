# Career Tracker 

A jobs tracker application built with vanilla `Web Components` as frontend and `WordPress` & `PHP` as backend. This repo is for frontend codebase.

Project starts with using Vite to bundle site files, but then got converted to using `importmap` without any build steps. Well, technically when deploy to Netlify, Netlify does an automatic `npm install` to install Cucumber Web Components into `node_modules` folder, and then these components are imported via importmap.
