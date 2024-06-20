import java.util.UUID;

import at.favre.lib.crypto.bcrypt.BCrypt;
import com.mongodb.MongoException;
import com.mongodb.client.model.Filters;
import com.mongodb.client.model.Updates;
import com.mongodb.client.result.UpdateResult;
import io.github.cdimascio.dotenv.Dotenv;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;

import org.bson.codecs.configuration.CodecProvider;
import org.bson.codecs.configuration.CodecRegistry;
import org.bson.codecs.pojo.PojoCodecProvider;
import org.bson.conversions.Bson;
import org.bson.types.ObjectId;

import static com.mongodb.MongoClientSettings.getDefaultCodecRegistry;
import static com.mongodb.client.model.Sorts.descending;
import static org.bson.codecs.configuration.CodecRegistries.fromProviders;
import static org.bson.codecs.configuration.CodecRegistries.fromRegistries;

import static com.mongodb.client.model.Filters.eq;

public class MongoDataDriver implements DataDriver {

    private final String mongoURL;
    private final CodecProvider pojoCodecProvider;
    private final CodecRegistry pojoCodecRegistry;
    MongoCollection<Experience> experiences;
    MongoCollection<Module> modules;
    MongoCollection<User> users;
    MongoCollection<Result> results;
    private MongoClient mongoClient;
    private MongoDatabase database;

    public MongoDataDriver(String mongoURL) {
        this.mongoURL = mongoURL;
        // create a PojoCodecProvider used to serialize and deserialize POJO object
        pojoCodecProvider = PojoCodecProvider.builder().automatic(true).build();
        // create a CodecRegistry used to define the way of serializing & deserializing
        pojoCodecRegistry = fromRegistries(getDefaultCodecRegistry(), fromProviders(pojoCodecProvider));
    }

    /**
     * Initialise la connexion à la base de données
     * @return true si la connexion fonctionne, false sinon
     */
    public boolean init()  {
        // Création du client mongo pour accéder aux fonctionnalités
        mongoClient = MongoClients.create(mongoURL);
        // Configuration des variables d'environnement
        Dotenv dotenv = Dotenv.configure().load();
        String name_db = dotenv.get("DATABASE_NAME");
        try {
            // Récupération de la base de données avec l'option définissant la manière de sérialiser
            database = mongoClient.getDatabase(name_db).withCodecRegistry(pojoCodecRegistry);
            experiences = database.getCollection("experiences", Experience.class);
            modules = database.getCollection("modules", Module.class);
            users = database.getCollection("users", User.class);
            results = database.getCollection("results", Result.class);
        }
        catch(IllegalArgumentException e) {
            return false;
        }
        return true;
    }

    /**
     * Récupère le numéro de la dernière expérience dans la base de données
     * @return le numéro de la dernière expérience
     */
    public synchronized int getLastExperience(){
        Experience experience = experiences.find().sort(descending("numero")).first();
        return experience.getNumero();
    }

    public synchronized User getUser(){
        return users.find(eq("name", "Patel")).first();
    }

    /**
     * Requête d'ajout d'un nouveau utilisateur dans la base de données
     * @param user l'utilisateur à ajouter
     * @return un string avec les résultats de la requête
     */
    public synchronized String addUser(User user){
        // Création d'un ID unique pour le nouvel user
        ObjectId key = generateUniqueKey("user");
        user.setId(key);
        String password = user.getPassword();
        // Cryptage du mot de passe avant l'insertion en base de données
        String bcryptHashString = BCrypt.withDefaults().hashToString(10, password.toCharArray());
        user.setPassword(bcryptHashString);
        try {
            users.insertOne(user);
        } catch (MongoException me) {
            System.err.println("Unable to insert due to an error: " + me);
            return "ERR unable to create the user";
        }
        return "OK " + user.getName() + " " + user.getId();
    }

    /**
     * Requête d'ajout de nouveaux résultats dans la base de données
     * @param numero le numéro de l'expérience
     * @param reactTime le temps de réaction
     * @param execTime le temps d'exécution
     * @param nbErrors le nombre d'erreurs
     * @param user l'objet user correspondant à celui ayant fait l'expérience
     * @return un string avec le résultat de la requête
     */
    public synchronized String addResults(String numero, float reactTime, float execTime, int nbErrors, User user){
        int num = Integer.parseInt(numero);
        // Requête pour récupérer le experience _id à partir de son numéro
        Experience experience = experiences.find(eq("numero", num)).first();
        // Création d'un ID unique pour le nouveau résultat
        ObjectId _id = generateUniqueKey("result");
        Result result = new Result(_id, experience.getId(), reactTime, execTime, nbErrors);
        try {
            results.insertOne(result);
        } catch (MongoException me) {
            System.err.println("Unable to insert due to an error: " + me);
            return "ERR unable to create the result";
        }

        // Met à jour les résultats d'un user en ajoutant le nouveau résultat
        Bson update = Updates.addToSet("results", result);
        Bson query = Filters.eq("_id", user.getId());
        UpdateResult updateResult = users.updateOne(query, update);
        // Affiche le nombre de documents mis à jour et insérés s'il y en a
//        System.out.println("Modified document count: " + updateResult.getModifiedCount());
        return "OK";
    }

    /**
     * Génère une clé unique pour un nouveau document
     * @param collection la collection où le document sera ajouté
     * @return la clé unique
     */
    public ObjectId generateUniqueKey(String collection){
        // Génération d'une clé UUID aléatoire
        UUID key = UUID.randomUUID();
        ObjectId id = null;
        boolean stop = false;
        while(!stop) {
            // On vérifie pour chaque collection indépendemment si l'ID existe déjà
            if(collection.equals("result")){
                id = getResultId(key.toString());
            }
            else if(collection.equals("user")){
                id = getUserId(key.toString());
            }

            // Tant que l'ID n'est pas unique, on continue d'en générer un
            if (id == null) {
                stop = true;
            }
            else {
                key = UUID.randomUUID();
            }
        }
        return id;
    }

    /**
     * Récupère l'ID d'un résultat à partir de sa clé
     * @param moduleKey la clé du résultat
     * @return l'ID du résultat ou null si le résultat n'existe pas
     */
    private ObjectId getResultId(String moduleKey) {
        Result result = results.find(eq("_id",moduleKey)).first();
        if (result != null) {
            return result.getId();
        }
        return null;
    }

    /**
     * Récupère l'ID de l'utilisateur à partir de sa clé
     * @param moduleKey la clé de l'utilisateur
     * @return l'ID de l'utilisateur ou null si l'utilisateur n'existe pas
     */
    private ObjectId getUserId(String moduleKey) {
        User user = users.find(eq("_id",moduleKey)).first();
        if (user != null) {
            return user.getId();
        }
        return null;
    }
}
