import java.io.IOException;
import java.net.URI;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.bson.Document;

import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoCursor;
import com.mongodb.client.MongoDatabase;

import org.bson.codecs.configuration.CodecProvider;
import org.bson.codecs.configuration.CodecRegistry;
import org.bson.codecs.pojo.PojoCodecProvider;
import org.bson.codecs.pojo.annotations.BsonProperty;
import org.bson.types.ObjectId;

import static com.mongodb.MongoClientSettings.getDefaultCodecRegistry;
import static org.bson.codecs.configuration.CodecRegistries.fromProviders;
import static org.bson.codecs.configuration.CodecRegistries.fromRegistries;

import static com.mongodb.client.model.Filters.eq;

public class MongoDataDriver implements DataDriver {

    private String mongoURL;
    private CodecProvider pojoCodecProvider;
    private CodecRegistry pojoCodecRegistry;
    private MongoClient mongoClient;
    private MongoDatabase database;
    MongoCollection<Experience> experiences;
    MongoCollection<Module> modules;
    MongoCollection<User> users;
    MongoCollection<Result> results;

    public MongoDataDriver(String mongoURL) {
        this.mongoURL = mongoURL;
        // create a PojoCodecProvider used to serialize and deserialize POJO object
        pojoCodecProvider = PojoCodecProvider.builder().automatic(true).build();
        // create a CodecRegistry used to define the way of serializing & deserializing
        pojoCodecRegistry = fromRegistries(getDefaultCodecRegistry(), fromProviders(pojoCodecProvider));
    }

    public boolean init()  {
        mongoClient = MongoClients.create(mongoURL);
        String name_db = System.getenv("DATABASE_NAME");
        try {
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

    private ObjectId getModuleId(String moduleKey) {
        Module module = modules.find(eq("key",moduleKey)).first();
        if (module != null) {
//            System.out.println(module.getKey()+ " -> "+module.getId());

            return module.getId();
        }
        return null;
    }

    private ObjectId getChipsetId(String chipsetName) {
//        Chipset chipset = chipsets.find(eq("name",chipsetName)).first();
        Chipset chipset = null;
        if (chipset != null) {
            System.out.println(chipset.getName()+ " -> "+chipset.getId());

            return chipset.getId();
        }
        return null;
    }

    public String addUser(String name, String firstname, String password, String email, int age, String gender, String typeUser){
        return "";
    }

    public String addResults(String idExp, int reactTime, int execTime, User user){
        return "";
    }

    public synchronized  String autoRegisterModule(String uc, List<String> chipsets) {
        List<ObjectId> lst = new ArrayList<>();
        for(String chipset : chipsets) {
            ObjectId id = getChipsetId(chipset);
            if (id != null) {
                lst.add(id);
            }
        }
        // must generate an unique key
        UUID key = UUID.randomUUID();
        boolean stop = false;
        while(!stop) {
            ObjectId id = getModuleId(key.toString());
            if (id == null) {
                stop = true;
            }
            else {
                key = UUID.randomUUID();
            }
        }
        long nb = modules.estimatedDocumentCount()+1;
        String name = "module "+nb;
        String shortName = "mod"+nb;
//        Module m = new Module(name, shortName, key.toString(), uc, lst);
//        modules.insertOne(m);
//        return "OK "+m.getName()+","+m.getShortName()+","+m.getKey();
        return "";
    }

    public synchronized String saveMeasure(String type, String date, String value, String moduleKey) {

        ObjectId idModule = getModuleId(moduleKey);
        if (idModule == null) {
            return "ERR invalid module key";
        }
        Measure m = new Measure(type, LocalDateTime.parse(date), value, idModule);
//        measures.insertOne(m);
        return "OK";
    }

    public synchronized String saveAnalysis(String type, String date, String value) {
        Measure m = new Measure(type, LocalDateTime.parse(date), value, null);
//        measures.insertOne(m);
        return "OK";
    }
}
