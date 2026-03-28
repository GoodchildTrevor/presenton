import UploadPage from "./(presentation-generator)/upload/components/UploadPage";
import Header from "./(presentation-generator)/dashboard/components/Header";

const page = () => {
    return (
        <div className="relative">
            <Header />
            <div className="flex flex-col items-center justify-center py-8">
                <h1 className="text-3xl font-semibold font-instrument_sans">
                    Создать презентацию{" "}
                </h1>
            </div>
            <UploadPage />
        </div>
    )
}

export default page
