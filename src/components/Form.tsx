import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import { FormRegisterType, PlaceType } from "../type/form.type";
import { useEffect, useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { uploadFileToStorage } from "../firebase/uploadFileToStorage";
import { useNavigate } from "react-router-dom";

export default function FormRegister() {
  const [provinsiList, setProvinsiList] = useState<PlaceType[]>([]);
  const [kotaList, setKotaList] = useState<PlaceType[]>([]);
  const [kecamatanList, setKecamatanList] = useState<PlaceType[]>([]);
  const [kelurahanList, setKelurahanList] = useState<PlaceType[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json")
      .then((res) => res.json())
      .then((data) => setProvinsiList(data))
      .catch((error) => console.error("Error mengambil provinsi:", error));
  }, []);

  const fetchKota = (provinsiId: number) => {
    fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${provinsiId}.json`)
      .then((res) => res.json())
      .then((data) => {
        setKotaList(data);
        setKecamatanList([]);
        setKelurahanList([]);
      })
      .catch((error) => console.error("Error mengambil kota:", error));
  };

  const fetchKecamatan = (kotaId: number) => {
    fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/districts/${kotaId}.json`)
      .then((res) => res.json())
      .then((data) => {
        setKecamatanList(data);
        setKelurahanList([]);
      })
      .catch((error) => console.error("Error mengambil kecamatan:", error));
  };

  const fetchKelurahan = (kecamatanId: number) => {
    fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/villages/${kecamatanId}.json`)
      .then((res) => res.json())
      .then((data) => setKelurahanList(data))
      .catch((error) => console.error("Error mengambil kelurahan:", error));
  };

  const FILE_SIZE_LIMIT = 2 * 1024 * 1024;
  const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/png", "image/bmp"];
  const FormRegisterSchema = yup.object().shape({
    nama: yup.string().required("Nama harus diisi"),
    nik: yup
      .string()
      .matches(/^\d{16}$/, "NIK harus terdiri dari 16 digit")
      .required("NIK harus diisi"),
    nomor_kartu_keluarga: yup
      .string()
      .matches(/^\d{16}$/, "Nomor Kartu Keluarga harus terdiri dari 16 digit")
      .required("Nomor Kartu Keluarga harus diisi"),
    umur: yup.number().min(25).required("Umur Harus diisi"),
    jenis_kelamin: yup.string().required("Jenis Kelamin harus diisi"),
    provinsi: yup.string().required("Provinsi harus diisi"),
    kota: yup.string().required("Kota harus diisi"),
    kecamatan: yup.string().required("Kecamatan harus diisi"),
    kelurahan: yup.string().required("Kelurahan harus diisi"),
    alamat: yup.string().max(255).required("Alamat harus diisi"),
    rt: yup.string().required("RT harus diisi"),
    rw: yup.string().required("RW harus diisi"),
    penghasilan_sebelum_pandemi: yup.number().required("Penghasilan sebelum pandemi harus diisi"),
    penghasilan_setelah_pandemi: yup.number().required("Penghasilan setelah pandemi harus diisi"),
    alasan_membutuhkan_bantuan: yup.string().required("Alasan membutuhkan bantuan harus diisi"),
    foto_ktp: yup
      .mixed()
      .required("Foto KTP harus diupload")
      .test("fileSize", "File harus kurang dari 2MB", (value) => {
        if (value && value instanceof File) {
          return value.size <= FILE_SIZE_LIMIT;
        }
        return true;
      })
      .test("fileFormat", "Hanya format JPG, JPEG, PNG, BMP yang diperbolehkan", (value) => {
        if (value && value instanceof File) {
          return SUPPORTED_FORMATS.includes(value.type);
        }
        return true;
      }),
    foto_kartu_keluarga: yup
      .mixed()
      .required("Foto Kartu Keluarga harus diupload")
      .test("fileSize", "File harus kurang dari 2MB", (value) => {
        if (value && value instanceof File) {
          return value.size <= FILE_SIZE_LIMIT;
        }
        return true;
      })
      .test("fileFormat", "Hanya format JPG, JPEG, PNG, BMP yang diperbolehkan", (value) => {
        if (value && value instanceof File) {
          return SUPPORTED_FORMATS.includes(value.type);
        }
        return true;
      }),
    pernyataan: yup.boolean().oneOf([true]),
  });

  const onForm = async (data: FormRegisterType) => {
    try {
      const simulateServerResponse = () => {
        return new Promise<void>((resolve, reject) => {
          const responseTime = Math.random() * 1500;
          setTimeout(() => {
            const isError = Math.random() < 0.2;
            if (isError) {
              reject(new Error("Internal Server Error"));
            } else {
              resolve();
            }
          }, responseTime);
        });
      };

      const fileUrls = await Promise.all([
        data.foto_ktp ? uploadFileToStorage(data.foto_ktp, "ktp") : Promise.resolve(""),
        data.foto_kartu_keluarga ? uploadFileToStorage(data.foto_kartu_keluarga, "kartu-keluarga") : Promise.resolve(""),
      ]);

      await simulateServerResponse();

      await addDoc(collection(db, "forms"), {
        ...data,
        foto_ktp: fileUrls[0],
        foto_kartu_keluarga: fileUrls[1],
      });

      alert("Form submitted successfully!");
      navigate(`/list-forms`);
    } catch (error) {
      console.error("Error saving data:", error);
      alert("An error occurred while submitting the form. Please try again.");
    }
  };

  return (
    <div className="card">
      <Formik
        initialValues={
          {
            nama: "",
            nik: "",
            nomor_kartu_keluarga: "",
            foto_ktp: null,
            foto_kartu_keluarga: null,
            umur: "",
            jenis_kelamin: "",
            provinsi: "",
            kota: "",
            kecamatan: "",
            kelurahan: "",
            alamat: "",
            rt: "",
            rw: "",
            penghasilan_sebelum_pandemi: "",
            penghasilan_setelah_pandemi: "",
            alasan_membutuhkan_bantuan: "",
            pernyataan: false,
          } as unknown as FormRegisterType
        }
        validationSchema={FormRegisterSchema}
        onSubmit={onForm}
      >
        {({ setFieldValue, dirty, isValid, validateField }) => {
          return (
            <Form>
              <div className="card p-4 bg-base-100 shadow-md rounded-lg">
                {/* Nama */}
                <div className="form-control mb-4">
                  <label htmlFor="nama" className="label">
                    <span className="label-text">Nama</span>
                  </label>
                  <Field type="text" placeholder="Masukkan Nama" name="nama" className="input input-bordered w-full" />
                  <ErrorMessage component="div" name="nama" className="text-error mt-1" />
                </div>

                {/* NIK */}
                <div className="form-control mb-4">
                  <label htmlFor="nik" className="label">
                    <span className="label-text">NIK</span>
                  </label>
                  <Field type="text" placeholder="Masukkan NIK" name="nik" className="input input-bordered w-full" />
                  <ErrorMessage component="div" name="nik" className="text-error mt-1" />
                </div>

                {/* Nomor Kartu Keluarga */}
                <div className="form-control mb-4">
                  <label htmlFor="nomor_kartu_keluarga" className="label">
                    <span className="label-text">Nomor Kartu Keluarga </span>
                  </label>
                  <Field type="text" placeholder="Masukkan Nomor Kartu Keluarga" name="nomor_kartu_keluarga" className="input input-bordered w-full" />
                  <ErrorMessage component="div" name="nomor_kartu_keluarga" className="text-error mt-1" />
                </div>

                {/* Foto KTP */}
                <div className="form-control mb-4">
                  <label htmlFor="foto_ktp" className="label">
                    <span className="label-text">
                      Foto KTP <span className="text-error">(Foto tidak boleh lebih dari 2MB dan hanya format JPG, JPEG, PNG, BMP yang diperbolehkan)</span>
                    </span>
                  </label>
                  <input
                    type="file"
                    name="foto_ktp"
                    onChange={(event) => {
                      const file = event.currentTarget.files ? event.currentTarget.files[0] : null;
                      setFieldValue("foto_ktp", file);
                      validateField("foto_ktp");
                    }}
                    className="file-input file-input-bordered w-full"
                  />
                  <ErrorMessage component="div" name="foto_ktp" className="text-error mt-1" />
                </div>

                {/* Foto Kartu Keluarga */}
                <div className="form-control mb-4">
                  <label htmlFor="foto_kartu_keluarga" className="label">
                    <span className="label-text">
                      Foto Kartu Keluarga <span className="text-error">(Foto tidak boleh lebih dari 2MB dan hanya format JPG, JPEG, PNG, BMP yang diperbolehkan)</span>
                    </span>
                  </label>
                  <input
                    type="file"
                    name="foto_kartu_keluarga"
                    onChange={(event) => {
                      const file = event.currentTarget.files ? event.currentTarget.files[0] : null;
                      setFieldValue("foto_kartu_keluarga", file);
                      validateField("foto_kartu_keluarga");
                    }}
                    className="file-input file-input-bordered w-full"
                  />
                  <ErrorMessage component="div" name="foto_kartu_keluarga" className="text-error mt-1" />
                </div>

                {/* Umur */}
                <div className="form-control mb-4">
                  <label htmlFor="umur" className="label">
                    <span className="label-text">Umur</span>
                  </label>
                  <Field type="number" placeholder="Masukkan Umur" name="umur" className="input input-bordered w-full" />
                  <ErrorMessage component="div" name="umur" className="text-error mt-1" />
                </div>

                {/* Jenis Kelamin */}
                <div className="form-control mb-4">
                  <label htmlFor="jenis_kelamin" className="label">
                    <span className="label-text">Jenis Kelamin</span>
                  </label>
                  <Field as="select" name="jenis_kelamin" className="select select-bordered w-full">
                    <option value="" label="Pilih Jenis Kelamin" />
                    <option value="Laki-laki" label="Laki-laki" />
                    <option value="Perempuan" label="Perempuan" />
                  </Field>
                  <ErrorMessage component="div" name="jenis_kelamin" className="text-error mt-1" />
                </div>

                {/* Provinsi */}
                <div className="form-control mb-4">
                  <label htmlFor="provinsi" className="label">
                    <span className="label-text">Provinsi</span>
                  </label>
                  <Field
                    as="select"
                    name="provinsi"
                    className="select select-bordered w-full"
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                      const provinsiId = Number(e.target.value);
                      setFieldValue("provinsi", provinsiId);
                      fetchKota(provinsiId);
                    }}
                  >
                    <option value="">Pilih Provinsi</option>
                    {provinsiList.map((provinsi: { id: number; name: string }) => (
                      <option key={provinsi.id} value={provinsi.id}>
                        {provinsi.name}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage component="div" name="provinsi" className="text-error mt-1" />
                </div>

                {/* Kota/Kabupaten */}
                <div className="form-control mb-4">
                  <label htmlFor="kota" className="label">
                    <span className="label-text">Kota/Kabupaten</span>
                  </label>
                  <Field
                    as="select"
                    name="kota"
                    className="select select-bordered w-full"
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                      const kotaId = Number(e.target.value);
                      setFieldValue("kota", kotaId);
                      fetchKecamatan(kotaId); // Correct function to call here
                    }}
                  >
                    <option value="">Pilih Kota/Kabupaten</option>
                    {kotaList.map((kota: { id: number; name: string }) => (
                      <option key={kota.id} value={kota.id}>
                        {kota.name}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage component="div" name="kota" className="text-error mt-1" />
                </div>

                {/* Kecamatan */}
                <div className="form-control mb-4">
                  <label htmlFor="kecamatan" className="label">
                    <span className="label-text">Kecamatan</span>
                  </label>
                  <Field
                    as="select"
                    name="kecamatan"
                    className="select select-bordered w-full"
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                      const kecamatanId = Number(e.target.value);
                      setFieldValue("kecamatan", kecamatanId);
                      fetchKelurahan(kecamatanId);
                    }}
                  >
                    <option value="">Pilih Kecamatan</option>
                    {kecamatanList.map((kecamatan: { id: number; name: string }) => (
                      <option key={kecamatan.id} value={kecamatan.id}>
                        {kecamatan.name}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage component="div" name="kecamatan" className="text-error mt-1" />
                </div>

                {/* Kelurahan */}
                <div className="form-control mb-4">
                  <label htmlFor="kelurahan" className="label">
                    <span className="label-text">Kelurahan</span>
                  </label>
                  <Field
                    as="select"
                    name="kelurahan"
                    className="select select-bordered w-full"
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                      const kelurahanId = Number(e.target.value);
                      setFieldValue("kelurahan", kelurahanId);
                    }}
                  >
                    <option value="">Pilih Kelurahan</option>
                    {kelurahanList.map((kelurahan: { id: number; name: string }) => (
                      <option key={kelurahan.id} value={kelurahan.id}>
                        {kelurahan.name}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage component="div" name="kelurahan" className="text-error mt-1" />
                </div>

                {/* Alamat */}
                <div className="form-control mb-4">
                  <label htmlFor="alamat" className="label">
                    <span className="label-text">Alamat</span>
                  </label>
                  <Field type="text" placeholder="Masukkan Alamat" name="alamat" className="input input-bordered w-full" />
                  <ErrorMessage component="div" name="alamat" className="text-error mt-1" />
                </div>

                {/* RT */}
                <div className="form-control mb-4">
                  <label htmlFor="rt" className="label">
                    <span className="label-text">RT</span>
                  </label>
                  <Field type="text" placeholder="Masukkan RT" name="rt" className="input input-bordered w-full" />
                  <ErrorMessage component="div" name="rt" className="text-error mt-1" />
                </div>

                {/* RW */}
                <div className="form-control mb-4">
                  <label htmlFor="rw" className="label">
                    <span className="label-text">RW</span>
                  </label>
                  <Field type="text" placeholder="Masukkan RW" name="rw" className="input input-bordered w-full" />
                  <ErrorMessage component="div" name="rw" className="text-error mt-1" />
                </div>

                {/* Penghasilan Sebelum Pandemi */}
                <div className="form-control mb-4">
                  <label htmlFor="penghasilan_sebelum_pandemi" className="label">
                    <span className="label-text">Penghasilan Sebelum Pandemi</span>
                  </label>
                  <Field type="number" placeholder="Masukkan Penghasilan Sebelum Pandemi" name="penghasilan_sebelum_pandemi" className="input input-bordered w-full" />
                  <ErrorMessage component="div" name="penghasilan_sebelum_pandemi" className="text-error mt-1" />
                </div>

                {/* Penghasilan Setelah Pandemi */}
                <div className="form-control mb-4">
                  <label htmlFor="penghasilan_setelah_pandemi" className="label">
                    <span className="label-text">Penghasilan Setelah Pandemi</span>
                  </label>
                  <Field type="number" placeholder="Masukkan Penghasilan Setelah Pandemi" name="penghasilan_setelah_pandemi" className="input input-bordered w-full" />
                  <ErrorMessage component="div" name="penghasilan_setelah_pandemi" className="text-error mt-1" />
                </div>

                {/* Alasan Membutuhkan Bantuan */}
                <div className="form-control mb-4">
                  <label htmlFor="alasan_membutuhkan_bantuan" className="label">
                    <span className="label-text">Alasan Membutuhkan Bantuan</span>
                  </label>
                  <Field as="textarea" placeholder="Masukkan Alasan Membutuhkan Bantuan" name="alasan_membutuhkan_bantuan" className="textarea textarea-bordered w-full" />
                  <ErrorMessage component="div" name="alasan_membutuhkan_bantuan" className="text-error mt-1" />
                </div>

                {/* Pernyataan */}
                <div className="form-control mb-4">
                  <label className="cursor-pointer flex items-center space-x-2">
                    <Field type="checkbox" name="pernyataan" />
                    <span className="label-text">Saya menyatakan bahwa data yang diisikan adalah benar dan siap mempertanggungjawabkan apabila ditemukan ketidaksesuaian dalam data tersebut.</span>
                  </label>
                  <ErrorMessage component="div" name="pernyataan" className="text-error mt-1" />
                </div>

                {/* Submit Button */}
                <div className="form-control mt-4">
                  <button type="submit" className="btn btn-primary w-full" disabled={!dirty || !isValid}>
                    Kirim
                  </button>
                </div>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
}
