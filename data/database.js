import * as SQLite from 'expo-sqlite';

// Open database using the new API
const db = SQLite.openDatabaseSync('storeKeeper.db');

export const setupDatabase = () => {
	try {
		db.execSync(
			`CREATE TABLE IF NOT EXISTS products (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				name TEXT NOT NULL,
				quantity INTEGER NOT NULL,
				price REAL NOT NULL,
				image TEXT
			);`
		);
		console.log("Database and products table successfully created.");
	} catch (error) {
		console.error('Error creating table:', error);
	}
};

export const addProduct = ({name, quantity, price, image}) => {
	try {
		const result = db.runSync(
			`INSERT INTO products (name, quantity, price, image) VALUES (?, ?, ?, ?);`,
			[name, quantity, price, image]
		);
		console.log('Product added successfully, ID:', result.lastInsertRowId);
		return result.lastInsertRowId;
	} catch (error) {
		console.error('Error adding product:', error);
		throw error;
	}
};

// Get all products
export const getProducts = () => {
	try {
		const products = db.getAllSync(`SELECT * FROM products;`);
		return products;
	} catch (error) {
		console.error('Error getting products:', error);
		return [];
	}
};

// Update product
export const updateProduct = ({id, name, quantity, price, image}) => {
	try {
		db.runSync(
			`UPDATE products SET name = ?, quantity = ?, price = ?, image = ? WHERE id = ?;`,
			[name, quantity, price, image, id]
		);
		console.log(`Product ID ${id} updated successfully.`);
	} catch (error) {
		console.error('Error updating product:', error);
		throw error;
	}
};

// Delete Product
export const deleteProduct = (id) => {
	try {
		db.runSync(
			`DELETE FROM products WHERE id = ?;`,
			[id]
		);
		console.log(`Product ID ${id} deleted.`);
	} catch (error) {
		console.error('Error deleting product:', error);
		throw error;
	}
};