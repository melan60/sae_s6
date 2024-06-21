import com.mongodb.client.MongoCollection;
import org.bson.types.ObjectId;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

public class MongoDataDriverUnitTest {

    @Test
    public void testAddUser() {
        MongoCollection<User> users = mock(MongoCollection.class);

        MongoDataDriver mongoDataDriver = new MongoDataDriver("mongodb://localhost:27017");
        mongoDataDriver.users = users;

        User user = new User();
        //user.setId(new ObjectId("65953e5a4c86afda83182529"));
        user.setName("Johnson");
        user.setTypeUser("admin");
        user.setAge("12");
        user.setPassword("123456");
        String response = mongoDataDriver.addUser(user);

        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
        verify(users, times(1)).insertOne(userCaptor.capture());

        User capturedUser = userCaptor.getValue();
        assertEquals("Johnson", capturedUser.getName());
        assertEquals(user.getPassword(), capturedUser.getPassword());

        assertEquals("OK Johnson " + capturedUser.getId(), response);
    }
}
