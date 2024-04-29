import mysql.connector

def insert_location_data(cur):
    print("Enter Location table data:")
    print()
    street_address = input("Enter street address: ")
    city = input("Enter city: ")
    state_province = input("Enter state/province: ")
    country_id = input("Enter country code: ")
    print()
    sql = "INSERT INTO locations (street_address, city, state_province, country_id) VALUES (%s, %s, %s, %s)"
    val = (street_address, city, state_province, country_id)
    cur.execute(sql, val)

def insert_country_data(cur):
    print("Enter Countries table data:")
    print()
    country_id = input("Enter country ID:")
    country_name = input("Enter country Name:")
    region_id = input("Enter region id:")
    print()
    sql = "INSERT INTO countries (country_id, country_name,region_id) VALUES (%s, %s, %s)"
    val = (country_id, country_name, region_id)
    cur.execute(sql, val)

def find_address(cur):
    country_name = input("Enter country name to apply join condition on that country name: ")
    cur.execute('''SELECT l.location_id, l.street_address, l.city, l.state_province, c.country_name, c.country_id
                   FROM locations l
                   JOIN countries c ON l.country_id = c.country_id
                   WHERE c.country_name = %s ''', (country_name,))
    rows = cur.fetchall()
    print()
    for row in rows:
        print(row)
        
    print()    

try:
    conn = mysql.connector.connect(
        host="localhost",
        user="root",
        password="8204",
        database="safertek"
    )
    cur = conn.cursor()

    cur.execute('''CREATE TABLE IF NOT EXISTS locations (
                    location_id INT AUTO_INCREMENT PRIMARY KEY,
                    street_address VARCHAR(255),
                    city VARCHAR(255),
                    state_province VARCHAR(255),
                    country_id VARCHAR(2)
                )''')

    cur.execute('''CREATE TABLE IF NOT EXISTS countries (
                    country_id VARCHAR(2) PRIMARY KEY,
                    country_name VARCHAR(255),
                    region_id VARCHAR(255)
                )''')

    actions = {
        '1': insert_location_data,
        '2': insert_country_data,
        '3': find_address
    }

    while True:
        print("Select an option:")
        print("1. Insert Location Data")
        print("2. Insert Countries Data")
        print("3. Find Address")
        print("4. Exit")
        choice = input("Enter your choice: ")

        if choice == '4':
            break

        action = actions.get(choice)
        if action:
            action(cur)
            conn.commit()
        else:
            print("Invalid choice!")

except mysql.connector.Error as err:
    print("MySQL Error:", err)

finally:
    if 'cur' in locals() and cur is not None:
        cur.close()
    if 'conn' in locals() and conn is not None:
        conn.close()
