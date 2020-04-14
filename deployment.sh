#!/bin/bash
npm run build --prefix front-end
cp -rfa front-end/build/. back-end/public
gcloud app deploy back-end --stop-previous-version
gcloud app browse