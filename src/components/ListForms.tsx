import { useEffect, useState } from "react";
import { FormItemType } from "../type/form.type";
import FormItem from "./partial/_formItem";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

export default function ListForms() {
  const [listForm, setListForm] = useState<FormItemType[]>([]);

  const fetchData = async () => {
    try {
      const formCollection = collection(db, "forms");
      const formSnapshot = await getDocs(formCollection);
      const formsData = formSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as FormItemType[];
      setListForm(formsData);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const formDoc = doc(db, "forms", id);
      await deleteDoc(formDoc);
      setListForm(listForm.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Failed to delete form:", error);
    }
  };

  return (
    <div className="card">
      <table className="table">
        <thead>
          <tr>
            <th>No</th>
            <th>Nama</th>
            <th>Alasan Membutuhkan Bantuan</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {listForm.map((item, index) => (
            <FormItem
              key={index}
              index={index + 1}
              id={item.id}
              nama={item.nama}
              alasan_membutuhkan_bantuan={item.alasan_membutuhkan_bantuan}
              onDelete={() => {
                if (item.id) {
                  handleDelete(item.id);
                }
              }}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
