package com.example.social.Data;

import java.util.HashMap;
import java.util.Map;

public class userData {
    public String id, user;
    public Map<String, String> timestamp;

    public userData(String id,String user, Map<String, String> timestamp ){
        this.id = id;
        this.user = user;
        this.timestamp = timestamp;

    }
}
