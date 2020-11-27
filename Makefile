deploy:
	netlify deploy --dir=build

gulp:
	npx gulp

reset:
	rm -rf build/

prod: reset gulp deploy
