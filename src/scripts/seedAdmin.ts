import { prisma } from "../lib/prisma";
import { UserRole } from "../middlewares/auth";

async function seedAdmin() {
  try {
    console.log("**** Admin Seeding Started!!***");
    const adminData = {
      name: "Admin2 Saheb",
      email: "admin2@gmail.com",
      role: UserRole.ADMIN,
      password: "admin1234",
    };
console.log("*** Checking admin Exist or not***");
    const existingUser = await prisma.user.findUnique({
      where: {
        email: adminData.email,
      },
    });

    if (existingUser) {
      throw new Error("User already exists");
    }

    const signUpAdmin = await fetch(
      "http://localhost:3000/api/auth/sign-up/email",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(adminData),
      }
    );

    if (signUpAdmin.ok) {
        
    console.log("*** Admin Created***");
      await prisma.user.update({
        where: {
          email: adminData.email,
        },
        data: {
          emailVerified: true,
        },
      });

      console.log("**Email Verified status updated");
    }

    console.log("***SUCCESS***");
  } catch (error) {
    console.log(error);
  }
}

seedAdmin();
