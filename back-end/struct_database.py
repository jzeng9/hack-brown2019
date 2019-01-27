
import sqlite3

conn = sqlite3.connect('test.db')
c = conn.cursor()
c.execute('''CREATE TABLE COMPANY
       (NAME TEXT PRIMARY KEY     NOT NULL,
       PASSWORD           TEXT    NOT NULL,
       PATH            TEXT     NOT NULL);''')
conn.commit()
conn.close()