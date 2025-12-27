import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { gigService } from "../../services/gig.service";

const CreateGig = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    pay: "",
    difficulty: "Medium",
    requirements: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.title || !form.description || !form.pay) {
      setError("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);

      await gigService.createGig({
        title: form.title,
        description: form.description,
        pay: Number(form.pay),
        difficulty: form.difficulty,
        requirements: form.requirements,
      });

      navigate("/creator/gigs");
    } catch (err) {
      console.error(err);
      setError("Failed to create gig");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-[100vw] bg-black flex justify-center items-center px-4">
      <div className="w-[100vw] max-w-xl bg-[#111] border border-gray-800 rounded-xl p-8">
        
        <h1 className="text-2xl font-semibold text-white mb-6">
          Create New Gig
        </h1>

        {error && (
          <p className="text-red-500 text-sm mb-4">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <input
            name="title"
            placeholder="Gig title"
            value={form.title}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded bg-black border border-gray-700 text-white focus:outline-none focus:border-blue-500"
          />

          <textarea
            name="description"
            placeholder="Gig description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            className="w-full px-4 py-2 rounded bg-black border border-gray-700 text-white focus:outline-none focus:border-blue-500"
          />

          <input
            name="pay"
            type="number"
            placeholder="Pay amount"
            value={form.pay}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded bg-black border border-gray-700 text-white focus:outline-none focus:border-blue-500"
          />

          <select
            name="difficulty"
            value={form.difficulty}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded bg-black border border-gray-700 text-white focus:outline-none focus:border-blue-500"
          >
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>

          <textarea
            name="requirements"
            placeholder="Requirements (optional)"
            value={form.requirements}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-2 rounded bg-black border border-gray-700 text-white focus:outline-none focus:border-blue-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Gig"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateGig;
