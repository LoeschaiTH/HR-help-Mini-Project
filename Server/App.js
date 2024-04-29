const express = require("express");
const app = express();
const port = 8000;
const multer = require("multer");
app.use(express.json());
const connection = require("./connectionDB");

app.listen(port, () => console.log("Server listening on port" + port));

let jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const secret = "dshushfd";

  function formatToMySQLDateTime(dateTimeString) {
    const date = new Date(dateTimeString);
    const formattedDateTime = date.toISOString().slice(0, 10);
    return formattedDateTime;
  }

app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  console.log(username, password);
  connection.query(
    "SELECT * FROM admin WHERE admin_username = ?",
    [username],
    (err, result) => {
      if (err) {
        res.json({ status: "error" });
        return;
      } else if (result.length > 0) {
        bcrypt.compare(password, result[0].admin_password, (err, islogin) => {
          console.log(result[0].admin_username);
          console.log(result[0].admin_password);
          if (islogin) {
            let token = jwt.sign(
              { user_name: result[0].admin_username },
              secret,
              { expiresIn: "1h" }
            );
            console.log(token);
            res.json({ status: "ok", message: "login success", token });
            return;
          } else {
            res.json({ status: "err", message: "password failed" });
            return;
          }
        });
      } else {
        res.json({ status: "err", message: "login failed" });
        return;
      }
    }
  );
});
app.post("/authentication", (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    let decoded = jwt.verify(token, secret);
    res.json({ status: "ok", decoded });
  } catch (err) {
    res.json({ status: "err" });
  }
});
app.get("/api/getUsers", (req, res) => {
  connection.query("SELECT * FROM admin", (err, result) => {
    if (err) {
      console.log(err);
    }
    res.json(result);
  });
});
app.post("/api/addUsers", (req, res) => {
  const { Token, username, password } = req.body;
  let addToken = "ad137900ph";
  if (Token === addToken) {
    bcrypt.hash(password, saltRounds, (err, hash) => {
      if (err) {
        console.log(err);
      }
      connection.query(
        "INSERT INTO admin (admin_username,admin_password) VALUES (?, ?)",
        [username, hash],
        (err, result) => {
          if (err) {
            console.error("Error executing INTO user: ", err.stack);
            res.status(500).json({ error: "Error executing INTO admin" });
          } else {
            res.json({ status: "sussess" });
          }
        }
      );
    });
  }
});

app.post('/api/checkUsername', (req, res) => {
  const { username } = req.body;
  connection.query('SELECT COUNT(*) AS count FROM admin WHERE admin_username = ?', [username], (err, results) => {
    if (err) {
      console.error("Error checking username:", err);
      return res.status(500).json({ error: "Error checking username" });
    }
    const count = results[0].count;
    if (count > 0) {
      res.json({ exists: true });
    } else {
      res.json({ exists: false });
    }
  });
});

app.post("/api/addHoliday", (req, res) => {
  const { dataHoliday } = req.body;
  console.log(dataHoliday.items[0]);
  const Listdata = dataHoliday.items[0];
  try {
    dataHoliday.items[0].list.map((item, index) => {
      const dateStart = item.Holiday[0];
      const dateEnd = item.Holiday[1];
      const description = item.first;
      console.log(index);

      const formattedDateStart = formatToMySQLDateTime(dateStart);
      const formattedDateEnd = formatToMySQLDateTime(dateEnd);

      console.log(
        "dateStart:",
        formattedDateStart,
        " dateEnd:",
        formattedDateEnd,
        " description:",
        description
      );
      connection.query(
        "INSERT INTO holiday (holiday_date_start,holiday_date_end,holiday_topic) VALUES (?, ?, ?)",
        [formattedDateStart, formattedDateEnd, description],
        (err, result) => {
          if (err) {
            console.error("Error executing INTO user: ", err.stack);
            res.status(500).json({ error: "Error executing INTO admin" });
          }
        }
      );
    });
  } catch (error) {
    console.log(error);
  }
  res.json({ status: "success" });
});

app.get("/api/getHoliday", (req, res) => {
  connection.query("SELECT * FROM holiday", (err, result) => {
    if (err) {
      console.error("Error executing SELECT holiday: ", err.stack);
      res.status(500).json({ error: "Error executing SELECT holiday" });
    }
    const SplitTime = result.map((item) => ({
      ID_holiday: item.ID_holiday,
      holiday_topic: item.holiday_topic,
      holiday_date_start: formatToMySQLDateTime(item.holiday_date_start),
      holiday_date_end: formatToMySQLDateTime(item.holiday_date_end),
    }));
    res.json(SplitTime);
  });
});

app.get("/api/getHoliYear", (req, res) => {
  connection.query(
    "SELECT holiday_topic, DATE(holiday_date_start) as holiday_date_start, DATE(holiday_date_end) as holiday_date_end FROM holiday WHERE YEAR(holiday_date_start) = YEAR(CURDATE()) AND YEAR(holiday_date_end) = YEAR(CURDATE())",
    (err, result) => {
      if (err) {
        console.error("Error executing SELECT holiday: ", err.stack);
        res.status(500).json({ error: "Error executing SELECT holiday" });
      }
      res.json(result);
    }
  );
});

app.get("/api/delHoliday", (req, res) => {
  const { key } = req.query;
  connection.query(
    "DELETE FROM holiday WHERE ID_holiday = ?",
    [key],
    (err, result) => {
      if (err) {
        console.error("Error executing DELETE holiday:", err.stack);
        res.status(500).json({ error: "Error executing DELETE holiday" });
        return;
      }
      res.json({ success: true });
    }
  );
});

app.get("/api/editHoliday", (req, res) => {
  const {
    key,
    new_holiday_topic_value,
    new_holiday_date_start_value,
    new_holiday_date_end_value,
  } = req.query;
  const sql = `UPDATE holiday SET 
                    holiday_date_start = '${new_holiday_date_start_value}', 
                    holiday_topic = '${new_holiday_topic_value}', 
                    holiday_date_end = '${new_holiday_date_end_value}' 
                WHERE ID_holiday = '${key}'`;
  connection.query(sql, (err, result) => {
    if (err) {
      console.error("Error executing UPDATE holiday:", err.stack);
      res.status(500).json({ error: "Error executing UPDATE holiday" });
      return;
    }
    res.json({ success: true });
  });
});

app.get("/api/editPublicized", (req, res) => {
  const {
      key,
      new_publicized_topic_value,
      new_publicized_datail,
      new_publicized_file,
      new_publicized_date_end_value
  } = req.query;
  const sql = `UPDATE publicized SET
                  publicized_topic='${new_publicized_topic_value}',
                  publicized_detail='${new_publicized_datail}',
                  publicized_file='${new_publicized_file}',
                  publicized_end='${new_publicized_date_end_value}' 
                  WHERE ID_publicized ='${key}'`
  connection.query(sql, (err, result) => {
      if (err) {
          console.error("Error executing UPDATE publicized:", err.stack);
          res.status(500).json({ error: "Error executing UPDATE publicized" });
          return;
      }
      res.json({ success: true });
  });
});

app.get('/api/delPublicized', (req, res) => {
  const { key } = req.query;
  connection.query('DELETE FROM publicized WHERE ID_publicized = ?', [key], (err, result) => {
      if (err) {
          console.error('Error executing DELETE publicized:', err.stack);
          res.status(500).json({ error: 'Error executing DELETE publicized' });
          return;
      }
      res.json({ success: true });
  });
});

app.get('/api/getPublicized', (req, res) => {
  connection.query('SELECT * FROM publicized', (err, result) => {
      if (err) {
          console.error('Error executing SELECT holiday: ', err.stack);
          res.status(500).json({ error: 'Error executing SELECT publicized' });
      }
      const SplitTime = result.map(item => ({
          ID_publicized: item.ID_publicized,
          publicized_topic: item.publicized_topic,
          publicized_detail: item.publicized_detail,
          publicized_file: item.publicized_file,
          publicized_end: formatToMySQLDateTime(item.publicized_end),
      }))
      res.json(SplitTime)
  })
})




const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    return callback(null, "./uploads/PDFNews");
  },
  filename: function (req, file, callback) {
    // return callback(null, `${Date.now()}_${file.originalname}`);
    return callback(null, (file.originalname));
  },
});
const upload = multer({ storage , encoding: 'utf-8'});
app.post("/api/addNews", upload.single('publicized_file'), async (req, res) => {
  const {
    publicized_topic,
    publicized_detail,
    publicized_start,
    publicized_end,
  } = req.body;
  const publicized_file= req.file.originalname;
  const formattedpublicized_end = formatToMySQLDateTime(publicized_end);
  sql = "INSERT INTO publicized (publicized_topic, publicized_detail, publicized_file,publicized_start, publicized_end) VALUES (?,?,?,?,?)";
    console.log("publicized_file",publicized_file);

  try {
    connection.query(
      sql,
      [
        publicized_topic,
        publicized_detail,
        publicized_file,
        publicized_start,
        formattedpublicized_end,
      ],
      (err, result, fields) => {
        if (err) {
          console.log("Error while inserting data into the database", err);
          return res.status(400).send();
        }
        return res.status(201).json({ message: "New user successfully created!!" });
      }
    );
  } catch (err) {
    console.log(err);
    return res.status(500).send();
  }
});

app.get("/api/ReadaddNews", async (req, res) => {
  try {
      connection.query("SELECT * FROM publicized ", (err, result, fields) => {
        console.log(result);
        if (err) {
          console.log(err);
          return res.status(400).send();
        }
        return res.status(200).json(result);
      })
  
  } catch (err) {
    console.log(err);
    return res.status(500).send();
  }
});


const path = require('path');
const fs = require('fs');
const downloadsPath = path.join(__dirname, 'uploads', 'PDFNews');

app.get("/api/getflieNews/:ID_publicized", (req, res) => {
  const ID_publicized = req.params.ID_publicized;
  console.log(ID_publicized);
  
  connection.query("SELECT publicized_file FROM publicized WHERE ID_publicized = ?", [ID_publicized], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'เกิดข้อผิดพลาดในการดึงข้อมูลจากฐานข้อมูล' });
    } else {
      console.log("zyyyyyyaaaaaaaaaa",ID_publicized)
      console.log("zyyyyyy00000000",result)
      if (result && result.length > 0 && result[0].publicized_file) {
        const filename = result[0].publicized_file;
        const filePath = path.join(downloadsPath, filename);
        console.log("eszyyyyyyy",filePath);

        fs.readFile(filePath, (err, data) => {
          if (err) {
            console.error(err);
            res.status(500).json({ error: 'เกิดข้อผิดพลาดในการอ่านไฟล์' });
          } else {
            const base64Data = Buffer.from(data).toString('base64');
            res.json({ pdfData: base64Data });
          }
        });
      } else {
        res.status(404).json({ error: 'ไม่พบไฟล์ที่ระบุหรือข้อมูลที่ค้นหา' });
      }
    }
  });
});

app.get('/api/download', (req, res) => {
  const filename = req.query.filename;
  const filePath = path.join(downloadsPath, filename);

  console.log(filename);
  console.log(filePath);

    res.sendFile(filePath);

});

app.post("/api/updateNewsPDF", upload.single('publicized_file'), async (req, res) => {
  const headline = req.body.Headline;
  const description = req.body.Description;
  const id = req.body.ID_publicized;
  const endDate = req.body.endDate;
  console.log(id, headline, description, endDate)

  if (req.fileValidationError) {
    return res.status(400).send(req.fileValidationError);
  } else if (!req.file) {

    connection.query("UPDATE publicized SET publicized_topic=?, publicized_detail=?,publicized_end=? WHERE ID_publicized=?",
    [headline, description, endDate, id],

    (err, result) => {
      if (err) {
        console.error("Error executing UPDATE publicized: ", err.stack);
        return res.status(500).json({ error: "Error executing UPDATE publicized" });
      }
      res.json({ status: "success", message: "success" });
      return;
    });
  } else{
    const publicized_file = req.file.originalname;
    console.log(publicized_file)

      connection.query("UPDATE publicized SET publicized_topic=?, publicized_detail=?,publicized_end=?, publicized_file=? WHERE ID_publicized=?",
    [headline, description, endDate, publicized_file, id],
    (err, result) => {
      if (err) {
        console.error("Error executing UPDATE publicized: ", err.stack);
        return res.status(500).json({ error: "Error executing UPDATE publicized" });
      }
      res.json({ status: "success", message: "success" });
      return;
    });
  }

});

app.delete('/api/delete-file/:fileName', (req, res) => {
  const fileName = req.params.fileName;
  const filePath = path.join(__dirname, 'uploads', 'PDFNews',fileName);

  // ตรวจสอบว่าไฟล์มีอยู่หรือไม่
  fs.access(filePath, fs.constants.F_OK, (err) => {
      if (err) {
          console.error(err);
          return res.status(404).send('File not found');
      }

      // ลบไฟล์
      fs.unlink(filePath, (err) => {
          if (err) {
              console.error(err);
              return res.status(500).send('Error deleting file');
          }

          console.log(`File ${fileName} deleted successfully`);
          res.status(200).send('File deleted successfully');
      });
  });
});







