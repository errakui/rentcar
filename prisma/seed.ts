import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create admin user
  const adminPassword = await bcrypt.hash("admin123", 12);
  const admin = await prisma.adminUser.upsert({
    where: { email: "admin@rentcar.ch" },
    update: {},
    create: {
      email: "admin@rentcar.ch",
      passwordHash: adminPassword,
      name: "Admin",
      role: "ADMIN",
    },
  });
  console.log("✅ Admin user created:", admin.email);

  // Create locations
  const lugano = await prisma.location.upsert({
    where: { id: "loc-lugano" },
    update: {},
    create: {
      id: "loc-lugano",
      name: "Sede Lugano",
      address: "Via Nassa 15",
      city: "Lugano",
      canton: "TI",
      openingHours: '{"lun-ven": "08:00-18:30", "sab": "09:00-13:00"}',
    },
  });

  const zurigo = await prisma.location.upsert({
    where: { id: "loc-zurigo" },
    update: {},
    create: {
      id: "loc-zurigo",
      name: "Sede Zurigo",
      address: "Bahnhofstrasse 50",
      city: "Zurigo",
      canton: "ZH",
      openingHours: '{"lun-ven": "07:30-19:00", "sab": "09:00-14:00"}',
    },
  });
  console.log("✅ Locations created");

  // Create cars
  const cars = [
    {
      slug: "bmw-serie-3-2025",
      brand: "BMW",
      model: "Serie 3",
      trim: "320d M Sport",
      year: 2025,
      category: "SEDAN" as const,
      transmission: "AUTOMATIC" as const,
      fuelType: "DIESEL" as const,
      drivetrain: "RWD" as const,
      seats: 5,
      doors: 4,
      luggage: 3,
      powerKw: 140,
      powerHp: 190,
      locationId: lugano.id,
      minAge: 23,
      kmPerDay: 150,
    },
    {
      slug: "mercedes-classe-a-2025",
      brand: "Mercedes-Benz",
      model: "Classe A",
      trim: "A 200 AMG Line",
      year: 2025,
      category: "CITY" as const,
      transmission: "AUTOMATIC" as const,
      fuelType: "PETROL" as const,
      drivetrain: "FWD" as const,
      seats: 5,
      doors: 5,
      luggage: 2,
      powerKw: 120,
      powerHp: 163,
      locationId: lugano.id,
      kmPerDay: 150,
    },
    {
      slug: "audi-q5-2025",
      brand: "Audi",
      model: "Q5",
      trim: "40 TDI quattro S line",
      year: 2025,
      category: "SUV" as const,
      transmission: "AUTOMATIC" as const,
      fuelType: "DIESEL" as const,
      drivetrain: "AWD" as const,
      seats: 5,
      doors: 5,
      luggage: 4,
      powerKw: 150,
      powerHp: 204,
      locationId: zurigo.id,
      minAge: 25,
      kmPerDay: 200,
    },
    {
      slug: "porsche-911-2025",
      brand: "Porsche",
      model: "911",
      trim: "Carrera S",
      year: 2025,
      category: "LUXURY" as const,
      transmission: "AUTOMATIC" as const,
      fuelType: "PETROL" as const,
      drivetrain: "RWD" as const,
      seats: 2,
      doors: 2,
      luggage: 1,
      powerKw: 331,
      powerHp: 450,
      locationId: lugano.id,
      minAge: 30,
      minLicenseYears: 5,
      baseFranchise: 5000,
      kmPerDay: 100,
    },
    {
      slug: "vw-transporter-2024",
      brand: "Volkswagen",
      model: "Transporter",
      trim: "T6.1 Comfortline",
      year: 2024,
      category: "VAN" as const,
      transmission: "AUTOMATIC" as const,
      fuelType: "DIESEL" as const,
      drivetrain: "FWD" as const,
      seats: 9,
      doors: 5,
      luggage: 5,
      powerKw: 110,
      powerHp: 150,
      locationId: zurigo.id,
      kmPerDay: 200,
    },
    {
      slug: "tesla-model-3-2025",
      brand: "Tesla",
      model: "Model 3",
      trim: "Long Range",
      year: 2025,
      category: "SEDAN" as const,
      transmission: "AUTOMATIC" as const,
      fuelType: "ELECTRIC" as const,
      drivetrain: "AWD" as const,
      seats: 5,
      doors: 4,
      luggage: 3,
      powerKw: 324,
      powerHp: 441,
      locationId: lugano.id,
      kmPerDay: 200,
    },
  ];

  for (const carData of cars) {
    const car = await prisma.car.upsert({
      where: { slug: carData.slug },
      update: {},
      create: carData,
    });

    // Create rate plan for each car
    const prices: Record<string, { daily: number; weekly: number; deposit: number }> = {
      "bmw-serie-3-2025": { daily: 120, weekly: 750, deposit: 2000 },
      "mercedes-classe-a-2025": { daily: 89, weekly: 560, deposit: 1500 },
      "audi-q5-2025": { daily: 140, weekly: 900, deposit: 2500 },
      "porsche-911-2025": { daily: 450, weekly: 2800, deposit: 10000 },
      "vw-transporter-2024": { daily: 110, weekly: 700, deposit: 2000 },
      "tesla-model-3-2025": { daily: 130, weekly: 820, deposit: 2000 },
    };

    const p = prices[carData.slug];
    if (p) {
      await prisma.ratePlan.create({
        data: {
          carId: car.id,
          dailyPrice: p.daily,
          weeklyPrice: p.weekly,
          discount3Days: 5,
          discount7Days: 10,
          discount30Days: 20,
          kmIncluded: carData.kmPerDay,
          extraKmPrice: 0.50,
          deposit: p.deposit,
        },
      });
    }
  }
  console.log("✅ Cars + rate plans created");

  // Create extras
  const extras = [
    { name: "Seggiolino bambino", description: "Gruppo 0+/1 (0-18 kg)", price: 10, priceType: "PER_DAY" as const },
    { name: "Navigatore GPS", description: "GPS portatile con mappe CH/EU", price: 8, priceType: "PER_DAY" as const },
    { name: "Catene da neve", description: "Set catene per neve", price: 25, priceType: "ONE_TIME" as const },
    { name: "Secondo conducente", description: "Conducente aggiuntivo", price: 12, priceType: "PER_DAY" as const },
    { name: "Portapacchi", description: "Box da tetto 400L", price: 15, priceType: "PER_DAY" as const },
    { name: "WiFi Hotspot", description: "Router 4G portatile", price: 5, priceType: "PER_DAY" as const },
  ];

  for (const extra of extras) {
    await prisma.extra.create({ data: extra });
  }
  console.log("✅ Extras created");

  // Create insurance plans
  const insurancePlans = [
    { name: "Premium", description: "Franchigia ridotta a CHF 500", pricePerDay: 25, franchise: 500 },
    { name: "Full Cover", description: "Zero franchigia, copertura totale", pricePerDay: 45, franchise: 0 },
  ];

  for (const plan of insurancePlans) {
    await prisma.insurancePlan.create({ data: plan });
  }
  console.log("✅ Insurance plans created");

  // Create default settings
  const defaultSettings = [
    { key: "whatsapp_number", value: "41XXXXXXXXX" },
    { key: "currency", value: "CHF" },
    { key: "vat_rate", value: "0" },
    { key: "company_name", value: "RentCar SA" },
    { key: "min_rental_hours", value: "24" },
  ];

  for (const setting of defaultSettings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: {},
      create: setting,
    });
  }
  console.log("✅ Settings created");

  console.log("\n🎉 Seed complete!");
  console.log("📧 Admin login: admin@rentcar.ch / admin123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
