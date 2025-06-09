import React, { useState } from "react";

function TableauSalles({ type }) {
  // الحالات الموحدة لكل جدول
  const [cno, setCno] = useState(1);
  const [semaines, setSemaines] = useState(16);

  // جدول القاعات
  const [salles, setSalles] = useState([]);

  // إضافة قاعة جديدة
  const ajouterSalle = () => {
    setSalles([
      ...salles,
      {
        nom: "",
        // القيم الموحدة
        cno,
        semaines,
        // يمكنك إضافة المزيد من الحقول هنا إذا لزم الأمر
      },
    ]);
  };

  // تحديث اسم القاعة فقط (لأن CNO و Semaines موحدين)
  const handleChangeNom = (idx, value) => {
    const arr = [...salles];
    arr[idx].nom = value;
    setSalles(arr);
  };

  // عند تغيير القيم الموحدة، يتم تحديثها لكل القاعات
  const updateCno = (value) => {
    setCno(value);
    setSalles((prev) =>
      prev.map((salle) => ({
        ...salle,
        cno: value,
      }))
    );
  };

  const updateSemaines = (value) => {
    setSemaines(value);
    setSalles((prev) =>
      prev.map((salle) => ({
        ...salle,
        semaines: value,
      }))
    );
  };

  return (
    <div>
      <h3>جدول القاعات {type === "theorique" ? "النظرية" : type === "pratique" ? "التطبيقية" : ""}</h3>
      <div style={{ marginBottom: 16 }}>
        <label>
          CNO:
          <input
            type="number"
            value={cno}
            min={1}
            onChange={(e) => updateCno(Number(e.target.value))}
            style={{ marginLeft: 8, marginRight: 24 }}
          />
        </label>
        <label>
          Semaines:
          <input
            type="number"
            value={semaines}
            min={1}
            onChange={(e) => updateSemaines(Number(e.target.value))}
            style={{ marginLeft: 8 }}
          />
        </label>
      </div>
      <button onClick={ajouterSalle}>إضافة قاعة جديدة</button>
      <table style={{ marginTop: 16, width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid #ccc", padding: 8 }}>اسم القاعة</th>
            {/* تم الاستغناء عن عمودي CNO و Semaines */}
          </tr>
        </thead>
        <tbody>
          {salles.map((salle, idx) => (
            <tr key={idx}>
              <td style={{ border: "1px solid #ccc", padding: 8 }}>
                <input
                  value={salle.nom}
                  onChange={(e) => handleChangeNom(idx, e.target.value)}
                  placeholder="اسم القاعة"
                  style={{ width: "95%" }}
                />
              </td>
              {/* قيم CNO و Semaines موحدة ولا تظهر هنا */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TableauSalles;