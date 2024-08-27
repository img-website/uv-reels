"use client"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react";

const CategoryPage = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
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
    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 p-6">
            {categories.map((category, index) => (
                <div key={category?._id} className="relative bg-white border rounded-lg shadow-lg overflow-hidden">
                    <div className="p-4">
                        <div className="flex items-center">
                            <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
                                <Image
                                    src={category?.thumb || '/next.svg'}
                                    alt={category?.title}
                                    width={80}
                                    height={80}
                                    loading={index <= 0 ? 'eager' : 'lazy'}
                                    className="object-cover size-full"
                                    priority={index === 0 ? true : false}
                                />
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-semibold text-gray-900">{category?.title}</h3>
                                <p className="text-gray-500">{category?.blogCount} {category?.blogCount > 1 ? 'blogs' : 'blog'}</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-between items-center p-4 border-t">
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id={`active-${category?._id}`}
                                className="h-4 w-4 rounded border-gray-300 text-purple-700 focus:ring-purple-600 mr-2"
                            />
                            <label htmlFor={`active-${category?._id}`} className="text-gray-700">Active</label>
                        </div>
                        <div className="flex space-x-2">
                            <Link href={`/admin/category/edit/${category?._id}`} aria-label="Edit">
                                <button className="bg-purple-600 text-white px-3 py-1 rounded-md">Edit</button>
                            </Link>
                            <Link href={'/admin'} aria-label="Delete">
                                <button className="bg-red-600 text-white px-3 py-1 rounded-md">Delete</button>
                            </Link>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default CategoryPage