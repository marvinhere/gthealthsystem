package com.example.social;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.graphics.Bitmap;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import com.example.social.Data.userData;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.database.Query;
import com.google.firebase.database.ServerValue;
import com.google.firebase.database.ValueEventListener;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.MultiFormatWriter;
import com.google.zxing.WriterException;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.integration.android.IntentIntegrator;
import com.google.zxing.integration.android.IntentResult;
import com.journeyapps.barcodescanner.BarcodeEncoder;

public class PrincipalActivy extends AppCompatActivity {

    private FirebaseAuth mAuth;
    private DatabaseReference mDatabase;
    private String userId;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_principal_activy);
        mAuth = FirebaseAuth.getInstance();
        final FirebaseUser currentUser = FirebaseAuth.getInstance().getCurrentUser() ;
        ImageView logout = findViewById(R.id.logout);
        Button scanear = findViewById(R.id.scanear);

        userId = currentUser.getUid();


        updateUI(currentUser);

        logout.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                FirebaseAuth.getInstance().signOut();
                finish();
            }
        });


        scanear.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
               new IntentIntegrator(PrincipalActivy.this).initiateScan();


            }
        });





    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, @Nullable Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        final IntentResult result = IntentIntegrator.parseActivityResult(requestCode, resultCode, data);
        if(result!= null)
            if(result.getContents()!=null){
                //Toast toast = Toast.makeText(PrincipalActivy.this,result.getContents(),Toast.LENGTH_SHORT);
                //toast.show();
                Toast toast = Toast.makeText(PrincipalActivy.this,"CARGANDO",Toast.LENGTH_LONG);
                toast.show();
                final userData userData = new userData(userId,result.getContents(), ServerValue.TIMESTAMP);

                //Read if user exist
                mDatabase = FirebaseDatabase.getInstance().getReference("users").child(result.getContents());
                mDatabase.addListenerForSingleValueEvent(new ValueEventListener() {
                    @Override
                    public void onDataChange(@NonNull DataSnapshot dataSnapshot) {
                        if(dataSnapshot.getValue()!=null){
                            //Read if status is clean
                            if(dataSnapshot.child("status").getValue().equals("clean")){
                                //Save in the userPlaces Area
                                DatabaseReference pushReference = FirebaseDatabase.getInstance().getReference("userPlaces").push();
                                //Get the push key
                                final String push = pushReference.getKey();
                                pushReference.setValue(userData, new DatabaseReference.CompletionListener() {
                                    @Override
                                    public void onComplete(@Nullable DatabaseError databaseError, @NonNull DatabaseReference databaseReference) {

                                        if(databaseError==null){
                                            //Save the push in the user places section area
                                            DatabaseReference userArea = FirebaseDatabase.getInstance().getReference("users").child(result.getContents());
                                            userArea.child("places").push().child("id").setValue(push, new DatabaseReference.CompletionListener() {
                                                @Override
                                                public void onComplete(@Nullable DatabaseError databaseError, @NonNull DatabaseReference databaseReference) {
                                                    if(databaseError==null){
                                                        Intent i = new Intent(PrincipalActivy.this,Verification.class);
                                                        i.putExtra("text","LISTO");
                                                        startActivity(i);

                                                    }else{
                                                        Toast toast = Toast.makeText(PrincipalActivy.this,"ERROR DE DB",Toast.LENGTH_SHORT);
                                                        toast.show();
                                                    }
                                                }
                                            });
                                        }else{
                                            Toast toast = Toast.makeText(PrincipalActivy.this,"ERROR DE DB",Toast.LENGTH_SHORT);
                                            toast.show();
                                        }


//

                                    }
                                });
                            }else if(dataSnapshot.child("status").getValue().equals("blocked")){
                                Intent i = new Intent(PrincipalActivy.this,Verification.class);
                                i.putExtra("text","BLOQUEADO");
                                startActivity(i);
                            }

                        }else{
                            Toast t = Toast.makeText(PrincipalActivy.this,"Codigo Alterado",Toast.LENGTH_SHORT);
                            t.show();
                        }
                    }

                    @Override
                    public void onCancelled(@NonNull DatabaseError databaseError) {

                    }
                });

            }
    }



    private void updateUI(FirebaseUser user){
        if(user!=null){

        }else{
            Intent i = new Intent(PrincipalActivy.this, MainActivity.class);
            startActivity(i);
        }

    }

    private void registerData(){

    }

    @Override
    public void onBackPressed(){

    }


}
