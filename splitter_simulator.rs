// A small Rust example (not CosmWasm) that demonstrates splitting logic for testing.
fn split(amount: f64, splits: &[(String, f64)]) {
    for (k, v) in splits {
        let part = amount * (v/100.0);
        println!("{} -> {}", k, part);
    }
}

fn main() {
    let splits = vec![("food".to_string(),50.0),("education".to_string(),30.0),("savings".to_string(),20.0)];
    split(1000.0, &splits);
}
