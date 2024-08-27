import CategoryForm from "../../categoryForm"

const EditPage = ({ params }) => {
    return (
        <CategoryForm id={params?.id} />
    )
}

export default EditPage