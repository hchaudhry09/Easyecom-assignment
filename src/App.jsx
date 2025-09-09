import React, { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { parse, isBefore } from "date-fns";

const SKILLS = [
  "Java","Angular","CSS","HTML","JavaScript","UI","SQL","React","PHP",
  "GIT","AWS","Python","Django","C","C++","C#","Unity","R","AI","NLP",
  "Photoshop","Node.js"
];

const DESIGNATIONS = ["Developer", "Manager", "System Admin", "Team Lead", "PM"];

function Sidebar({ currentPage, setCurrentPage }) {
  return (
    <aside className="sidebar">
      <h2 className="sidebar-title">Company App</h2>
      <nav className="sidebar-nav">
        <button
          onClick={() => setCurrentPage("list")}
          className={currentPage === "list" ? "active" : ""}
        >
          📋 Company List
        </button>
        <button
          onClick={() => setCurrentPage("new")}
          className={currentPage === "new" ? "active" : ""}
        >
          ➕ New Company
        </button>
      </nav>
    </aside>
  );
}

function CompanyList({ companies, onEdit, onDelete }) {
  return (
    <div className="content">
      <h1>Company List</h1>
      {companies.length === 0 ? (
        <p>No companies added yet. Click "New Company" to add one.</p>
      ) : (
        <div className="table-wrapper">
          <table className="company-table">
            <thead>
              <tr>
                <th>Company Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Created At</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {companies.map((c, i) => (
                <tr key={i}>
                  <td>{c.companyName}</td>
                  <td>{c.email}</td>
                  <td>{c.phoneNumber}</td>
                  <td>{c.createdAt}</td>
                  <td>
                    <button className="btn-edit" onClick={() => onEdit(i)}>
                      Edit
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => onDelete(i)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function SkillSection({ control, empIndex, register }) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `empInfo.${empIndex}.skillInfo`,
  });

  return (
    <div className="sub-section">
      <h3>Skills</h3>
      {fields.map((skill, idx) => (
        <div key={skill.id} className="inline-fields">
          <select
            {...register(
              `empInfo.${empIndex}.skillInfo.${idx}.skillName`,
              { required: true }
            )}
          >
            <option value="">Select Skill</option>
            {SKILLS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <input
            type="number"
            min="1"
            max="5"
            {...register(
              `empInfo.${empIndex}.skillInfo.${idx}.skillRating`,
              { required: true }
            )}
            placeholder="1-5"
          />
          <button
            type="button"
            className="btn-delete small"
            onClick={() => remove(idx)}
          >
            ✖
          </button>
        </div>
      ))}
      <button
        type="button"
        className="btn-secondary"
        onClick={() => append({ skillName: "", skillRating: "" })}
      >
        + Add Skill
      </button>
    </div>
  );
}

function EducationSection({ control, empIndex, register }) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `empInfo.${empIndex}.educationInfo`,
  });

  return (
    <div className="sub-section">
      <h3>Education</h3>
      {fields.map((edu, idx) => (
        <div key={edu.id} className="inline-fields">
          <input
            {...register(
              `empInfo.${empIndex}.educationInfo.${idx}.instituteName`,
              { required: true }
            )}
            placeholder="Institute Name"
          />
          <input
            {...register(
              `empInfo.${empIndex}.educationInfo.${idx}.courseName`,
              { required: true }
            )}
            placeholder="Course Name"
          />
          <input
            {...register(
              `empInfo.${empIndex}.educationInfo.${idx}.completedYear`,
              { required: true }
            )}
            placeholder="e.g. Mar 2021"
          />
          <button
            type="button"
            className="btn-delete small"
            onClick={() => remove(idx)}
          >
            ✖
          </button>
        </div>
      ))}
      <button
        type="button"
        className="btn-secondary"
        onClick={() =>
          append({ instituteName: "", courseName: "", completedYear: "" })
        }
      >
        + Add Education
      </button>
    </div>
  );
}

function CompanyForm({ onSave, defaultValues }) {
  const { register, control, handleSubmit, reset } = useForm({
    defaultValues: defaultValues || {
      companyName: "",
      address: "",
      email: "",
      phoneNumber: "",
      empInfo: [],
    },
  });

  useEffect(() => {
    reset(
      defaultValues || {
        companyName: "",
        address: "",
        email: "",
        phoneNumber: "",
        empInfo: [],
      }
    );
  }, [defaultValues, reset]);

  const { fields: empFields, append: empAppend, remove: empRemove } =
    useFieldArray({
      control,
      name: "empInfo",
    });

  const validatePastDate = (value) => {
    if (!value) return "Required";
    const parsed = parse(value, "yyyy-MM-dd", new Date());
    return isBefore(parsed, new Date())
      ? true
      : "Join date must be in the past";
  };

  const onSubmit = (data) => {
    const payload = {
      ...data,
      createdAt: data.createdAt || new Date().toLocaleString(),
    };
    onSave(payload);
    alert("Company details saved successfully.");
    reset();
  };

  return (
    <form className="form-card" onSubmit={handleSubmit(onSubmit)}>
      <h1>{defaultValues ? "Edit Company" : "New Company"}</h1>

      <section>
        <h2>Company Info</h2>
        <input
          {...register("companyName", { required: true, maxLength: 50 })}
          placeholder="Company Name"
        />
        <input {...register("address")} placeholder="Address" />
        <input
          type="email"
          {...register("email", { required: true })}
          placeholder="Email"
        />
        <input
          {...register("phoneNumber", { required: true })}
          placeholder="Phone Number"
        />
      </section>

      <section>
        <h2>Employees</h2>
        {empFields.map((emp, empIndex) => (
          <details key={emp.id} className="accordion">
            <summary>
              Employee #{empIndex + 1}
              <button
                type="button"
                className="btn-delete small"
                onClick={() => empRemove(empIndex)}
              >
                ✖
              </button>
            </summary>
            <div className="accordion-content">
              <input
                {...register(`empInfo.${empIndex}.empName`, { required: true })}
                placeholder="Employee Name"
              />
              <select {...register(`empInfo.${empIndex}.designation`)}>
                <option value="">Select Designation</option>
                {DESIGNATIONS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
              <input
                type="date"
                {...register(`empInfo.${empIndex}.joinDate`, {
                  validate: validatePastDate,
                })}
              />
              <input
                type="email"
                {...register(`empInfo.${empIndex}.email`, { required: true })}
                placeholder="Email"
              />
              <input
                {...register(`empInfo.${empIndex}.phoneNumber`, {
                  required: true,
                })}
                placeholder="Phone Number"
              />

              <SkillSection
                control={control}
                empIndex={empIndex}
                register={register}
              />
              <EducationSection
                control={control}
                empIndex={empIndex}
                register={register}
              />
            </div>
          </details>
        ))}
        <button
          type="button"
          className="btn-secondary"
          onClick={() =>
            empAppend({
              empName: "",
              designation: "",
              joinDate: "",
              email: "",
              phoneNumber: "",
              skillInfo: [],
              educationInfo: [],
            })
          }
        >
          + Add Employee
        </button>
      </section>

      <div className="form-actions">
        <button type="submit" className="btn-primary">
          Save Company
        </button>
        <button
          type="button"
          className="btn-secondary"
          onClick={() => reset()}
        >
          Reset
        </button>
      </div>
    </form>
  );
}

export default function App() {
  const [currentPage, setCurrentPage] = useState("list");
  const [companies, setCompanies] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);

  useEffect(() => {
    const raw = localStorage.getItem("companies_v2");
    if (raw) setCompanies(JSON.parse(raw));
  }, []);

  useEffect(() => {
    localStorage.setItem("companies_v2", JSON.stringify(companies));
  }, [companies]);

  const handleSave = (companyData) => {
    if (editingIndex !== null && editingIndex >= 0) {
      const copy = [...companies];
      copy[editingIndex] = companyData;
      setCompanies(copy);
      setEditingIndex(null);
    } else {
      setCompanies((prev) => [companyData, ...prev]);
    }
    setCurrentPage("list");
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    setCurrentPage("new");
  };

  const handleDelete = (index) => {
    if (!window.confirm("Delete this company?")) return;
    setCompanies((prev) => prev.filter((_, i) => i !== index));
  };

  const editingData = editingIndex !== null ? companies[editingIndex] : null;

  return (
    <div className="app-layout">
      <Sidebar
        currentPage={currentPage}
        setCurrentPage={(p) => {
          setCurrentPage(p);
          if (p === "new") setEditingIndex(null);
        }}
      />
      <main className="main-content">
        {currentPage === "list" && (
          <CompanyList
            companies={companies}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
        {currentPage === "new" && (
          <CompanyForm
            key={editingIndex ?? "new"}
            onSave={handleSave}
            defaultValues={editingData}
          />
        )}
      </main>
    </div>
  );
}
