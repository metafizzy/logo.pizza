deploy:
	surge build logo.pizza

gulp:
	gulp

reset:
	rm -rf build/

prod: reset gulp deploy
