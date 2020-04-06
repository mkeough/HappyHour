docker build -t HappyHour-image .

docker tag HappyHour-image registry.heroku.com/HappyHour/web


docker push registry.heroku.com/HappyHour/web

heroku container:release web -a HappyHour