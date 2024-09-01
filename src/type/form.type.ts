export interface FormRegisterData {
  nama: string;
  nik: number;
  nomor_kartu_keluarga: number;
  foto_ktp: File;
  foto_kartu_keluarga: File;
  umur: number;
  jenis_kelamin: string;
  provinsi: string;
  kota: string;
  kecamatan: string;
  kelurahan: string;
  alamat: string;
  rt: string;
  rw: string;
  penghasilan_sebelum_pandemi: number;
  penghasilan_setelah_pandemi: number;
  alasan_membutuhkan_bantuan: string;
  pernyataan: boolean;
}

export interface PlaceType {
  id: number;
  name: string;
}

export interface FormItemType {
  index?: number;
  onDelete: () => void;
  id?: string | undefined;
  nama: string;
  alasan_membutuhkan_bantuan: string;
}

export interface FormItemDetails {
  id?: string | undefined;
  nama: string;
  nik: number;
  nomor_kartu_keluarga: number;
  foto_ktp: string | undefined;
  foto_kartu_keluarga: string | undefined;
  umur: number;
  jenis_kelamin: string;
  provinsi: string;
  kota: string;
  kecamatan: string;
  kelurahan: string;
  alamat: string;
  rt: string;
  rw: string;
  penghasilan_sebelum_pandemi: number;
  penghasilan_setelah_pandemi: number;
  alasan_membutuhkan_bantuan: string;
  pernyataan: boolean;
}

export interface FormRegisterType {
  id?: string | undefined;
  nama: string;
  nik: number;
  nomor_kartu_keluarga: number;
  foto_ktp: File;
  foto_kartu_keluarga: File;
  umur: number;
  jenis_kelamin: string;
  provinsi: number;
  kota: number;
  kecamatan: number;
  kelurahan: number;
  alamat: string;
  rt: string;
  rw: string;
  penghasilan_sebelum_pandemi: number;
  penghasilan_setelah_pandemi: number;
  alasan_membutuhkan_bantuan: string;
  pernyataan: boolean;
}
