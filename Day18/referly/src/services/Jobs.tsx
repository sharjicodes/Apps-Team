import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const jobSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  Department: z.string().email("Please enter a valid email"),
  Summary: z.string().min(10, "Summary must be at least 6 characters"),
  Type: z.string().min(1, { message: "Type is required" }),
  location: z.string().optional(),
  salary: z.number().positive({ message: "Salary must be a positive number" }).optional(),
});

type JobData = z.infer<typeof jobSchema>;

const Jobs = () => {

    const {
        handleSubmit,
        formState: { errors },
      } = useForm<JobData>({
        resolver: zodResolver(jobSchema),
      });

  const onSubmit = () => {
  alert("Job succesfully posted");
  
};
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white w-full">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-gray-800 p-8 rounded-lg w-full max-w-sm shadow-lg"
      >
      <h2 className="text-2xl font-bold mb-6 text-center">Post Job</h2>
      <div className="mb-4">
          <label className="block mb-1">Tittle</label>
          <input
            type="text"
            placeholder="Enter the title"
            className="w-full p-2 rounded bg-gray-700 focus:outline-none"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
        </div>

        <div className="mb-4">
          <label className="block mb-1">Department</label>
          <input
            type="text"
            placeholder="Enter the department"
            className="w-full p-2 rounded bg-gray-700 focus:outline-none"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
        </div>

        <div className="mb-4">
          <label className="block mb-1">Summary</label>
          <input
            type="text"
            
            className="w-full  p-2 rounded bg-gray-700 focus:outline-none"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
        </div>

        </form>
        </div>
  );
}

export default Jobs
