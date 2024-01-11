extern crate dotenv;
use dotenv::dotenv;
use inquire::Password;
use seahorse::{App, Command, Context};
use std::{env, fs::File, io::Read};
use log::info;

fn encrypt_action(ctx: &Context) {
    let file_path = ctx.args.get(0).expect("Profile flag is required");
    info!("Encrypt file {:?}", file_path);
    let mut file_desc = File::open(file_path).expect("Cannot open file to encrypt");
    let mut file_data = String::new();
    file_desc.read_to_string(&mut file_data).expect("Cannot read file");
    info!("File content: {:?}", file_data);
    let password = Password::new("Enter your password: ")
        .prompt()
        .expect("Unable to prompt password");
    info!("Password {:?}", password);
}

fn encrypt_command() -> Command {
    Command::new("encrypt").action(encrypt_action)
}

fn main() {
    dotenv().ok();
    env_logger::init_from_env(env_logger::Env::new().default_filter_or("info"));
    let args: Vec<String> = env::args().collect();
    let app = App::new("encrypted-storage")
        .version(env!("CARGO_PKG_VERSION"))
        .command(encrypt_command());
    app.run(args);
}
