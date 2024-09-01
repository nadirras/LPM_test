import Footer from "../components/Footer";
import FormRegister from "../components/Form";
import Navbar from "../components/Navbar";

const Home = () => {
  return (
    <div className="flex flex-col">
      <Navbar />
      <div className="my-5 flex justify-center items-center">
        <FormRegister />
      </div>
      <Footer />
    </div>
  );
};

export default Home;
