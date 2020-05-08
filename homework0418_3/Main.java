import java.util.Arrays;
import java.util.Scanner;
public class Main{
  static int[] bucket = new int[26];
  static boolean result = false;
  static Scanner input = new Scanner(System.in);
  public static void main(String args[]){
    System.out.printf("Please enter first string:");
    String word1 = input.next();
    System.out.printf("Please enter Second string:");
    String word2 = input.next();
    put(word1,word2);
    check();
    String show = "";
    if(result == true){
      show = "";
    }
    else{
      show = "not ";
    }
    System.out.printf("String1:%s and String2:%s is %sequal\n",word1,word2,show);
  }
  public static void put(String a,String b){
    for(int j = 0;j<26;j++){
      bucket[j] = 0;
    }
    if(a.length() != b.length()){
      return;
    }
    for(int i = 0;i<a.length();i++){
      bucket[a.charAt(i) - 'a']++;
      bucket[b.charAt(i) - 'a']--;
    }
  }
  public static void check(){
    for(int p:bucket){
      if(p != 0){
        result = false;
        return;
      }
    }
    result = true;
  }
}
