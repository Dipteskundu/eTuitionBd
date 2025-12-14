import axios from 'axios';

export const uploadImage = async (file) => {
    if (!file) return null;

    const formData = new FormData();
    formData.append('image', file);

    try {
        const response = await axios.post(
            `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_KEY}`,
            formData
        );
        return response.data.data.display_url;
    } catch (error) {
        console.error("Error uploading image to ImgBB:", error);
        throw error;
    }
};
