# Création des répertoires
mkdir -p out-docker/server out-docker/client

# Compilation des fichiers server
javac -d out-docker/server -cp "lib/*" server/src/*.java

# Compilation des fichiers client
javac -d out-docker/client -cp "lib/*" client/src/*.java

# Création du fichier JAR server (c = créer un nouveau fichier JAR, v = verbose (affiche les détails des fichiers pdt l'execution), f = nom du fichier créé, m = fichier manifest)
jar -cvfm out-docker/server/server.jar server/MANIFEST_SERVER.MF -C out-docker/server/ .

# Création du fichier JAR client
jar -cvfm out-docker/client/client.jar client/MANIFEST_CLIENT.MF -C out-docker/client/ .