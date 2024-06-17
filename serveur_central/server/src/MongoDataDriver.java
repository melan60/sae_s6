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
     * Initialize the connection to the database
     *
     * @return true if the connection is successful, false otherwise
     */
    public boolean init() {
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
        } catch (IllegalArgumentException e) {
            return false;
        }
        return true;
    }

    /**
     * Get the last experience's number
     *
     * @return the last experience's number
     */
    public synchronized int getLastExperience() {
        Experience experience = experiences.find().sort(descending("numero")).first();
        return experience.getNumero();
    }

    // TODO supprimer cette méthode
    public synchronized User getUser() {
        return users.find(eq("name", "Patel")).first();
    }

    /**
     * Request to add a new user in the database
     *
     * @param user the user to add
     * @return a string containing the result of the request
     */
    public synchronized String addUser(User user) {
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
     * Request to add a new result in the database
     *
     * @param numero    the experience's number
     * @param reactTime the reaction time
     * @param execTime  the execution time
     * @param nbErrors  the number of errors
     * @param user      the user who did the experience
     * @return a string containing the result of the request
     */
    public synchronized String addResults(String numero, float reactTime, float execTime, int nbErrors, User user) {
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
     * Generate a unique key for a new document
     *
     * @param collection the collection where the document will be added
     * @return the unique key
     */
    public ObjectId generateUniqueKey(String collection) {
        // must generate a unique key
        UUID key = UUID.randomUUID();
        ObjectId id = null;
        boolean stop = false;
        while (!stop) {
            if (collection.equals("result")) {
                id = getResultId(key.toString());
            } else if (collection.equals("user")) {
                id = getUserId(key.toString());
            }

            // Tant que l'ID n'est pas unique, on continue d'en générer un
            if (id == null) {
                stop = true;
            } else {
                key = UUID.randomUUID();
            }
        }
        return id;
    }

    /**
     * Get the result's id using its key
     *
     * @param moduleKey the result's key
     * @return the result's id or null if the result doesn't exist
     */
    private ObjectId getResultId(String moduleKey) {
        Result result = results.find(eq("_id", moduleKey)).first();
        if (result != null) {
            return result.getId();
        }
        return null;
    }

    /**
     * Get the user's id using its key
     *
     * @param moduleKey the user's key
     * @return the user's id or null if the user doesn't exist
     */
    private ObjectId getUserId(String moduleKey) {
        User user = users.find(eq("_id", moduleKey)).first();
        if (user != null) {
            return user.getId();
        }
        return null;
    }
}
