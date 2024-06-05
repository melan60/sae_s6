//import static org.mockito.Mockito.*;
//import static org.junit.Assert.*;
//
//import org.bson.types.ObjectId;
//import org.junit.Before;
//import org.junit.jupiter.api.Test;
//
//import org.mockito.Mock;
//import org.mockito.MockitoAnnotations;
//import com.google.gson.Gson;
//import org.bson.Document;
//
//public class HttpDataDriverUnitTest {
//
//    @Mock
//    private HttpDataDriver httpDataDriver;
//
//    private User testUser;
//
//    @Before
//    public void setUp() {
//        MockitoAnnotations.initMocks(this);
//        testUser = new User();
//        testUser.setName("Test User");
//        testUser.setId(new ObjectId("65953e5a4c86afda83182523"));
//    }
//
//    @Test
//    public void testAddUserSuccess() {
//        ResultsModel resultsModel = new ResultsModel();
//        resultsModel.setUser(testUser);
//
//        Gson gson = new Gson();
//        String jsonRequest = gson.toJson(resultsModel);
//
//        Document responseDoc = new Document();
//        Document dataDoc = new Document();
//        dataDoc.put("name", "Test User");
//        dataDoc.put("_id", "12345");
//        responseDoc.put("data", dataDoc);
//
//        when(httpDataDriver.postRequest("/user/add", jsonRequest)).thenReturn(responseDoc);
//        when(httpDataDriver.checkError(responseDoc)).thenReturn(null);
//
//        String result = httpDataDriver.addUser(testUser);
//        assertEquals("OK Test User 12345", result);
//    }
//
//    @Test
//    public void testAddUserApiError() {
//        ResultsModel resultsModel = new ResultsModel();
//        resultsModel.setUser(testUser);
//
//        Gson gson = new Gson();
//        String jsonRequest = gson.toJson(resultsModel);
//
//        Document responseDoc = new Document();
//        when(httpDataDriver.postRequest("/user/add", jsonRequest)).thenReturn(responseDoc);
//        when(httpDataDriver.checkError(responseDoc)).thenReturn("Some error");
//
//        String result = httpDataDriver.addUser(testUser);
//        assertEquals("ERR wrong response from API", result);
//    }
//
//    @Test
//    public void testAddUserCannotJoinApi() {
//        ResultsModel resultsModel = new ResultsModel();
//        resultsModel.setUser(testUser);
//
//        Gson gson = new Gson();
//        String jsonRequest = gson.toJson(resultsModel);
//
//        when(httpDataDriver.postRequest("/user/add", jsonRequest)).thenReturn(null);
//
//        String result = httpDataDriver.addUser(testUser);
//        assertEquals("ERR cannot join the API", result);
//    }
//}
