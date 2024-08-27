"use client"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react"

const PostForm = ({ id }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState('');
    const [initialImage, setInitialImage] = useState('');
    const [categoryId, setcategoryId] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const router = useRouter();

    console.log(categoryId)

    const [categories, setCategories] = useState([]); useEffect(() => {
        const fetchCategory = async () => {
            setLoading(true);
            try {
                const response = await fetch(`/api/categories`);
                const data = await response.json();
                if (response.ok) {
                    setCategories(data);
                } else {
                    throw new Error(data?.message || 'Failed to fetch category');
                }
            } catch (err) {
                console.log(err?.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCategory();
    }, []);

    useEffect(() => {
        if (categories.length > 0 && !id) {
            setcategoryId(categories[0]?._id);
        }
    }, [categories, id]);

    useEffect(() => {
        if (id) {
            const fetchBlogs = async () => {
                setLoading(true);
                try {
                    const response = await fetch(`/api/blogs/${id}`);
                    const res = await response.json();
                    const data = res?.blog;
                    if (response.ok) {
                        setTitle(data?.title);
                        setDescription(data?.description);
                        setcategoryId(data?.categoryId || categories[0]?._id);
                        setInitialImage(data?.image);
                    } else {
                        throw new Error(data?.message || 'Failed to fetch category');
                    }
                } catch (err) {
                    setError(err?.message);
                } finally {
                    setLoading(false);
                }
            };

            fetchBlogs();
        }
    }, [id, categories]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const token = document.cookie
                .split('; ')
                .find(row => row.startsWith('token='))
                ?.split('=')[1];
            const method = id ? 'PATCH' : 'POST';
            const url = id ? `/api/blogs/${id}` : `/api/blogs?categoryId=${categoryId}`;

            console.log(categoryId)

            const formdata = new FormData();
            formdata.append('title', title);
            formdata.append('description', description);
            formdata.append('image', image);
            formdata.append('categoryId', categoryId);

            const response = await fetch(url, {
                method,
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formdata,
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Something went wrong');
            }

            setSuccess(`Blog ${id ? 'updated' : 'created'} successfully`);
        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className='grow'></div>
            <div className={`shadow-lg border rounded-xl mx-auto max-w-lg w-full ${loading ? "pointer-events-none" : ""}`}>
                <div className="md:text-lg text-base font-bold p-5 rounded-t-xl bg-gray-50">{id ? "Edit" : "Add"} Post</div>
                <hr />
                <div className="p-5 rounded-b-xl">
                    <form className='w-full' onSubmit={handleSubmit}>
                        <div className="sm:col-span-4 pb-5">
                            <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-800">
                                Post Title
                            </label>
                            <div className="mt-2">
                                <div className="flex rounded-xl shadow-sm ring-2 ring-inset ring-gray-400 focus-within:ring-2 focus-within:ring-inset focus-within:ring-purple-700">
                                    <input
                                        type="text"
                                        placeholder="Oh yes come on baby"
                                        autoComplete="off"
                                        required
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="block flex-1 border-0 bg-transparent py-3 text-gray-800 placeholder:text-gray-400 focus:ring-0 sm:text-base sm:leading-6"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="sm:col-span-4 pb-5">
                            <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-800">
                                Description
                            </label>
                            <div className="mt-2">
                                <div className="flex rounded-xl shadow-sm ring-2 ring-inset ring-gray-400 focus-within:ring-2 focus-within:ring-inset focus-within:ring-purple-700">
                                    <input
                                        type="text"
                                        placeholder="write some tagline"
                                        autoComplete="off"
                                        required
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        className="block flex-1 border-0 bg-transparent py-3 text-gray-800 placeholder:text-gray-400 focus:ring-0 sm:text-base sm:leading-6"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="col-span-full">
                            <label htmlFor="cover-photo" className="block text-sm font-medium leading-6 text-gray-800">
                                Category Icon
                            </label>
                            <div className="mt-2 flex justify-center rounded-xl relative border-2 border-dashed border-gray-800/50 bg-contain bg-no-repeat bg-center group/opacity" style={image ? { backgroundImage: `url(${URL.createObjectURL(image)})` } : { backgroundImage: `url(${initialImage})` }}>
                                <div className={`text-center px-6 py-10 group-hover/opacity:opacity-100 backdrop-blur-lg w-full flex items-center flex-col ${(image || initialImage) ? 'opacity-0 bg-gray-50/80' : ''}`}>
                                    {/* <PhotoIcon aria-hidden="true" className="mx-auto h-12 w-12 text-gray-400" /> */}
                                    <div className="mt-4 flex text-sm leading-6 text-gray-900 font-semibold">
                                        <label
                                            htmlFor="file-upload"
                                            className="cursor-pointer font-semibold text-purple-700 hover:text-purple-600"
                                        >
                                            <span>Upload a file</span>
                                            <input
                                                id="file-upload"
                                                name="file-upload"
                                                accept="image/*"
                                                required={!id}
                                                type="file"
                                                onChange={(e) => setImage(e.target.files[0])}
                                                className="absolute inset-0 z-10 opacity-0"
                                            />
                                        </label>
                                        <p className="pl-1">or drag and drop</p>
                                    </div>
                                    <p className="text-xs leading-5 text-gray-900 font-semibold">PNG, JPG, GIF up to 10MB</p>
                                </div>
                            </div>
                        </div>
                        <div className="sm:col-span-3">
                            <label htmlFor="category" className="block text-sm font-medium leading-6 text-gray-800">
                                Category
                            </label>
                            <div className="mt-2">
                                <select
                                    id="category"
                                    name="category"
                                    autoComplete="off"
                                    required
                                    value={categoryId}
                                    onChange={(e) => setcategoryId(e.target.value)}
                                    className="block w-full rounded-xl border-0 py-3 text-gray-800 shadow-sm ring-2 ring-inset ring-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-700 sm:text-base sm:leading-6 bg-transparent"
                                >
                                    {
                                        categories ? categories?.map((item) => {
                                            return (
                                                <option key={item?._id} value={item?._id}>{item?.title}</option>
                                            )
                                        })
                                            :
                                            <option>Categories not found</option>
                                    }
                                </select>
                            </div>
                        </div>

                        {error && <p style={{ color: 'red' }}>{error}</p>}
                        {success && <p style={{ color: 'green' }}>{success}</p>}
                        <div className="mt-6 flex items-center justify-end gap-x-6">
                            <button onClick={(e) => router.back()} type="button" className="text-sm font-semibold leading-6 text-gray-800">
                                {id ? "Cancel" : "Back"}
                            </button>
                            <button
                                type="submit"
                                className="rounded-md bg-purple-700 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-purple-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-700"
                            >
                                {id ? "Update" : "Save"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <div className='grow'></div>
        </>
    )
}

export default PostForm