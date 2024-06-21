# Création des répertoires
mkdir -p out-docker/

# Compilation des fichiers server
javac -d out-docker/ -cp "lib/*" ./src/FaceDetectorServer.java

# Compilation du fichier
jar -cvfm out-docker/FaceDetectorServer.jar MANIFEST_ANALYSE.MF -C out-docker/ .
