import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FormItemDetails } from "../type/form.type";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

const FormDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [formData, setFormData] = useState<FormItemDetails | null>(null);
  useEffect(() => {
    const fetchFormData = async () => {
      try {
        if (id) {
          const formDocRef = doc(db, "forms", id);
          const formDoc = await getDoc(formDocRef);
          if (formDoc.exists()) {
            setFormData({ id: formDoc.id, ...formDoc.data() } as FormItemDetails);
          } else {
            console.error("No such document!");
          }
        }
      } catch (error) {
        console.error("Error fetching form data:", error);
      }
    };
    fetchFormData();
  }, [id]);
  return (
    <div className="flex flex-col  h-screen">
      <Navbar />
      <div className="form-details ml-5 my-5">
        <h2>Detail Form</h2>
        <p>
          <strong>Nama:</strong> {formData?.nama}
        </p>
        <p>
          <strong>NIK:</strong> {formData?.nik}
        </p>
        <p>
          <strong>Nomor Kartu Keluarga:</strong> {formData?.nomor_kartu_keluarga}
        </p>
        <p>
          <strong>Umur:</strong> {formData?.umur}
        </p>
        <p>
          <strong>Jenis Kelamin:</strong> {formData?.jenis_kelamin}
        </p>
        <p>
          <strong>Provinsi:</strong> {formData?.provinsi}
        </p>
        <p>
          <strong>Kota:</strong> {formData?.kota}
        </p>
        <p>
          <strong>Kecamatan:</strong> {formData?.kecamatan}
        </p>
        <p>
          <strong>Kelurahan:</strong> {formData?.kelurahan}
        </p>
        <p>
          <strong>Alamat:</strong> {formData?.alamat}
        </p>
        <p>
          <strong>RT:</strong> {formData?.rt}
        </p>
        <p>
          <strong>RW:</strong> {formData?.rw}
        </p>
        <p>
          <strong>Penghasilan Sebelum Pandemi:</strong> {formData?.penghasilan_sebelum_pandemi}
        </p>
        <p>
          <strong>Penghasilan Setelah Pandemi:</strong> {formData?.penghasilan_setelah_pandemi}
        </p>
        <p>
          <strong>Alasan Membutuhkan Bantuan:</strong> {formData?.alasan_membutuhkan_bantuan}
        </p>

        {/* Display KTP Image */}
        <div>
          <strong>Foto KTP:</strong>
          <img src={formData?.foto_ktp} alt="Foto KTP" style={{ maxWidth: "300px", marginTop: "10px" }} />
        </div>

        {/* Display Kartu Keluarga Image */}
        <div>
          <strong>Foto Kartu Keluarga:</strong>
          <img src={formData?.foto_kartu_keluarga} alt="Foto Kartu Keluarga" style={{ maxWidth: "300px", marginTop: "10px" }} />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default FormDetails;
