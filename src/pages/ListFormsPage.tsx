import Footer from "../components/Footer";
import ListForms from "../components/ListForms";
import Navbar from "../components/Navbar";

const ListFormsPage = () => {
  return (
    <div className="flex flex-col">
      <Navbar />
      <div className="my-5 flex justify-center items-center h-screen">
        <ListForms />
      </div>
      <Footer />
    </div>
  );
};

export default ListFormsPage;
