const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  const token = localStorage.getItem("access_token");

  const data = new FormData();
  data.append("name", formData.name);
  data.append("address", formData.address);
  data.append("price", Number(formData.price));

  if (formData.email) data.append("email", formData.email);
  if (formData.phone) data.append("phone", formData.phone);
  if (imageFile) data.append("image", imageFile);

  try {
    await axios.post("https://mon-projet-django-b8xs.onrender.com/api/hotels/", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    alert("Hôtel ajouté avec succès !");
    onClose();
    window.location.reload();

  } catch (err) {
    console.error("ERREUR BACKEND :", err.response?.data);
    alert(JSON.stringify(err.response?.data, null, 2));
  } finally {
    setLoading(false);
  }
};
