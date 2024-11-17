const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

const AGENDA_API_URL = "http://www.raydelto.org/agenda.php";

app.get('/contacts', async (req, res) => {
    try {
        const response = await axios.get(AGENDA_API_URL);
        
        if (response.data) {
            res.json(response.data);
        } else {
            res.status(404).json({ error: "Not found contacts" });
        }
    } catch (error) {
        console.error("Error al obtener los contactos:", error);
        res.status(500).json({ error: "Error al obtener los contactos" });
    }
});

app.post('/contacts', async (req, res) => {
    const { nombre, apellido, telefono } = req.body;

    if (!nombre || !apellido || !telefono) {
        return res.status(400).json({ error: "Todos los campos son requeridos: nombre, apellido, telefono" });
    }

    try {
        const contactData = { nombre, apellido, telefono };

        const response = await axios.post(AGENDA_API_URL, contactData, {
            headers: { 'Content-Type': 'application/json' }
        });

        console.log("Respuesta de la API externa:", response.data);

        if (response.data.exito) {
            res.status(201).json({ message: "Contacto guardado Correctamente.", data: response.data });
        } else {
            res.status(400).json({ error: "Error gaurdando el contacto." });
        }
    } catch (error) {
        console.error("Error al guardar el contacto:", error);
        res.status(500).json({ error: "Error al guardar el contacto" });
    }
});

const PORT = 4000;
app.listen(PORT, () => {
    console.log(`Servicio corriendo en http://localhost:${PORT}`);
});
