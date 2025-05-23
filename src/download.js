import React, { useState } from "react";
import ReactDOMServer from "react-dom/server";

export default function Download() {
    const [date, setDate] = useState(getCurrentDate());
    const [time, setTime] = useState(getCurrentTime());
    const [age, setAge] = useState(37);
    const [height, setHeight] = useState(170);
    const [weight, setWeight] = useState(75);
    const [bmi, setBMI] = useState(25);
    const [fat, setFat] = useState(22);

    function getCurrentDate() {
        const currentDate = new Date();
        return currentDate.toLocaleDateString("en-NZ");
    }

    function getCurrentTime() {
        const currentDate = new Date();
        return currentDate.toLocaleTimeString("en-NZ", { hour12: false });
    }

    function getBMI(weight, height) {
        return Math.round(weight / ((height / 100) ** 2));
    }

    function getFat(bmi, age) {
        return Math.round((1.20 * bmi) + (0.23 * age) - 16.2);
    }

    function changeAge(age) {
        setAge(age);
        setFat(getFat(bmi, age));
    }

    function changeHeight(height) {
        setHeight(height);
        changeBMI(getBMI(weight, height));
    }

    function changeWeight(weight) {
        setWeight(weight);
        changeBMI(getBMI(weight, height));
    }

    function changeBMI(bmi) {
        setBMI(bmi);
        setFat(getFat(bmi, age));
    }

    function handleNumberInputChange(event) {
        const value = event.target.value;
        
        // Handle in-progress text input.
        if (value.slice(-1) === ".") {
            return value;
        }

        const numberValue = parseFloat(value);

        return numberValue.toFixed(precision(numberValue));
    }

    function precision(a) {
        if (!isFinite(a)) return 0;
        var e = 1, p = 0;
        while (Math.round(a * e) / e !== a) { e *= 10; p++; }
        return p;
    }

    function getOutput() {
        return (
            <code>
                Body{"\n"}
                Date,Time,Weight,BMI,Fat{"\n"}
                {date},{time},{weight},{bmi},{fat}{"\n"}
            </code>
        );
    }

    function getDataHREF() {
        const regex = /<[^>]*>/gm;
        return (
            "data:text/plain;base64," +
            btoa(
                ReactDOMServer.renderToString(getOutput()).replace(regex, "")
            )
        );
    }

    return (
        <form>
            <div>
                <label>
                    Date:
                    <input
                        name="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                </label>
            </div>
            <div>
                <label>
                    Time:
                    <input
                        name="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                    />
                </label>
            </div>
            <div>
                <label>
                    Age:
                    <input
                        name="age"
                        value={age}
                        onChange={(e) => changeAge(handleNumberInputChange(e))}
                    />
                </label>
            </div>
            <div>
                <label>
                    Height (cm):
                    <input
                        name="height"
                        value={height}
                        onChange={(e) =>
                            changeHeight(handleNumberInputChange(e))
                        }
                    />
                </label>
            </div>
            <div>
                <label>
                    Weight (kg):
                    <input
                        name="weight"
                        value={weight}
                        onChange={(e) =>
                            changeWeight(handleNumberInputChange(e))
                        }
                    />
                </label>
            </div>
            <div>
                <label>
                    BMI:
                    <input
                        name="bmi"
                        value={bmi}
                        onChange={(e) => changeBMI(handleNumberInputChange(e))}
                    />
                </label>
            </div>
            <div>
                <label>
                    Fat (%):
                    <input
                        name="fat"
                        value={fat}
                        onChange={(e) => setFat(handleNumberInputChange(e))}
                    />
                </label>
            </div>

            <hr />

            <div>
                <label>Preview:</label>
                <pre>{getOutput()}</pre>
            </div>

            <a
                role="button"
                href={getDataHREF()}
                download="weight.csv"
            >
                Download
            </a>

            <hr />

            <a
                className="secondary"
                role="button"
                href="https://connect.garmin.com/modern/import-data"
                target="_blank"
                rel="noreferrer"
            >
                Import Data
            </a>

            <hr />
        </form>
    );
}
