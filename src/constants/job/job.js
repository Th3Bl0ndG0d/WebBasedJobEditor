import Cylinder from "../cylinder/cylinder.js";


const Job = (id, number, name, date, info, repeat = 1, cylinders = []) => ({
    id,
    number,
    name,
    date,       // ✅ correcte veldnaam
    info,
    repeat,     // ✅ correct getal
    cylinders,  // ✅ correct array
});

export default Job;