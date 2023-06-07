-- CreateTable
CREATE TABLE "reservation" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "customer_id" UUID NOT NULL,
    "table_layout_id" UUID NOT NULL,
    "reservation_date" TIMESTAMP(6) NOT NULL,
    "reservation_time" TIME(6) NOT NULL,
    "special_requests" VARCHAR(255),

    CONSTRAINT "reservation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "restaurant" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "location" VARCHAR(255),
    "contact_information" VARCHAR(255),

    CONSTRAINT "restaurant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "table_layout" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "restaurant_id" UUID NOT NULL,
    "table_number" INTEGER NOT NULL,
    "seating_capacity" INTEGER NOT NULL,

    CONSTRAINT "table_layout_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" VARCHAR(255) NOT NULL,
    "firstName" VARCHAR(255),
    "lastName" VARCHAR(255),
    "roq_user_id" VARCHAR(255) NOT NULL,
    "tenant_id" VARCHAR(255) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "waiter" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "restaurant_id" UUID NOT NULL,

    CONSTRAINT "waiter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "waiter_assignment" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "waiter_id" UUID NOT NULL,
    "table_layout_id" UUID NOT NULL,

    CONSTRAINT "waiter_assignment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- AddForeignKey
ALTER TABLE "reservation" ADD CONSTRAINT "reservation_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "reservation" ADD CONSTRAINT "reservation_table_layout_id_fkey" FOREIGN KEY ("table_layout_id") REFERENCES "table_layout"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "restaurant" ADD CONSTRAINT "restaurant_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "table_layout" ADD CONSTRAINT "table_layout_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "restaurant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "waiter" ADD CONSTRAINT "waiter_restaurant_id_fkey" FOREIGN KEY ("restaurant_id") REFERENCES "restaurant"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "waiter" ADD CONSTRAINT "waiter_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "waiter_assignment" ADD CONSTRAINT "waiter_assignment_table_layout_id_fkey" FOREIGN KEY ("table_layout_id") REFERENCES "table_layout"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "waiter_assignment" ADD CONSTRAINT "waiter_assignment_waiter_id_fkey" FOREIGN KEY ("waiter_id") REFERENCES "waiter"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

