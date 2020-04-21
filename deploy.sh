docker build -t happy-hour-image .

docker tag happy-hour-image registry.heroku.com/sdg-happy-hour/web


docker push registry.heroku.com/sdg-happy-hour/web

heroku container:release web -a sdg-happy-hour