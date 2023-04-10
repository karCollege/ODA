import { Role } from "@/data/Role";
import { User } from "@/data/User";
import { SupabaseClient } from "@supabase/supabase-js";
import axios from "axios";

class AuthService {
  async signUp(supabase: SupabaseClient, email: string, password: string) {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error.message;
  }

  async logIn(supabase: SupabaseClient, email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error.message;

    return this.getProfile(supabase);
  }

  async isUsernameAvailable(supabase: SupabaseClient, userName: string) {
    const { data, error } = await supabase
      .from("profile")
      .select()
      .eq("userName", userName)
      .single();

    if (data) {
      return false;
    }

    return true;
  }

  async getProfileOf(supabase: SupabaseClient, uid: string) {
    const { data } = await supabase
      .from("profile")
      .select("*")
      .eq("uid", uid)
      .single();

      
    if (!data) return null;

    return {
      uid: data.uid,
      userName: data.userName,
      role: data.role,
    } as User;
  }

  async getProfile(supabase: SupabaseClient) {
    const { data, error } = await supabase
      .from("profile")
      .select("*")
      .eq("uid", (await supabase.auth.getUser()).data.user?.id)
      .single();

    if (!data) return null;

    return {
      uid: data.uid,
      userName: data.userName,
      role: data.role,
    } as User;
  }

  async createProfile(supabase: SupabaseClient, userName: String, role: Role) {
    const session = await supabase.auth.getSession();
    const currentUser = session.data.session?.user;

    if (!currentUser) {
      throw "Not Logged In";
    }

    const { data } = await supabase
      .from("profile")
      .select("*")
      .eq("uid", currentUser.id)
      .single();

    if (data) {
      return {
        email: currentUser.email,
        uid: currentUser.id,
        userName: data.userName,
        role: data.role,
      } as User;
    }

    console.log(userName, role);

    const { error } = await supabase.from("profile").insert({
      uid: currentUser.id,
      userName,
      role,
    });

    if (role == "customer") {
      this.createCustomer(supabase);
    } else if (role == "merchant") {
      this.createMerchant(supabase);
    }

    if (!error) {
      return {
        uid: currentUser.id,
        userName,
        role,
      } as User;
    }

    throw error;
  }

  private async createCustomer(supabase: SupabaseClient) {
    const session = await supabase.auth.getSession();
    const currentUser = session.data.session?.user;

    if (currentUser == null) throw "Not Logged In";

    const max = 9999;
    const min = 1001;

    await supabase.from("customer").insert({
      cid: currentUser.id,
      pin: Math.floor(Math.random() * (max - min + 1) + min),
    });
  }

  private createMerchant(supabase: SupabaseClient) {
    axios.get("/api/create_connect_account");
  }
}

const authService = new AuthService();
export default authService;
