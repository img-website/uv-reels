import PostForm from "../../postForm"

const EditPage = ({ params }) => {
    return (
        <PostForm id={params?.id} />
    )
}

export default EditPage