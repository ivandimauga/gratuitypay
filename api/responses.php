<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header("Access-Control-Allow-Origin: * ");
header("Access-Control-Allow-Headers: * ");
header("Access-Control-Allow-Methods: * ");

$db_conn = mysqli_connect("localhost", "root", "", "gratuitypay");
if($db_conn === false)
{
    die("ERROR: Could Not Connect".mysqli_connect_error());
}

$method = $_SERVER['REQUEST_METHOD'];

switch($method)
{
    case "GET":
        $alluser = mysqli_query($db_conn, "SELECT * FROM responses");
        if(mysqli_num_rows($alluser) > 0)
        {
            while($row = mysqli_fetch_array($alluser))
            {
                $projects = json_decode($row['projects'], true);
                $json_array["userdata"][] = array(
                    "submitName" => $row['submitName'],
                    "designation" => $row['designation'],
                    "contactNumber" => $row['contactNumber'],
                    "email" => $row['email'],
                    "_year" => $row['_year'],
                    "category" => $row['category'],
                    "department" => $row['department'],
                    "agency" => $row['agency'],
                    "university" => $row['university'],
                    "nameGOCC" => $row['nameGOCC'],
                    "nameLWD" => $row['nameLWD'],
                    "provinceLGU" => $row['provinceLGU'],
                    "cityMunicipalLGU" => $row['cityMunicipalLGU'],
                    "nameSUC" => $row['nameSUC'],
                    "nameOthers" => $row['nameOthers'],
                    "agencyHead" => $row['agencyHead'],
                    "_grant" => $row['_grant'],
                    "contractOfService" => $row['contractOfService'],
                    "jobOrder" => $row['jobOrder'],
                    "minimumRate" => $row['minimumRate'],
                    "maximumRate" => $row['maximumRate'],
                    "projects" => $projects,
                    "tallyRangeA" => $row['tallyRangeA'],
                    "tallyRangeB" => $row['tallyRangeB'],
                    "tallyRangeC" => $row['tallyRangeC'],
                    "tallyRangeD" => $row['tallyRangeD'],
                    "tallyRangeE" => $row['tallyRangeE'],
                    "nonGrantReason" => $row['nonGrantReason'],
                    "filename" => $row['filename'],
                    "filesize" => $row['filesize'],
                    "filetype" => $row['filetype'],
                );
            }
            echo json_encode($json_array["userdata"]);
            return;
        } else {
            echo json_encode(["result" => "Please check the data"]);
            return;
        }
    break;
    
    case "POST":
        $userpostdata = json_decode(file_get_contents("php://input"));

        $submitName = $_POST['submitName'];
        $designation = $_POST['designation'];
        $contactNumber = $_POST['contactNumber'];
        $email = $_POST['email'];
        $_year = $_POST['_year'];
        $category = $_POST['category'];
        $department = $_POST['department'];
        $agency = $_POST['agency'];
        $university = $_POST['university'];
        $nameGOCC = $_POST['nameGOCC'];
        $nameLWD = $_POST['nameLWD'];
        $provinceLGU = $_POST['provinceLGU'];
        $cityMunicipalLGU = $_POST['cityMunicipalLGU'];
        $nameSUC = $_POST['nameSUC'];
        $nameOthers = $_POST['nameOthers'];
        $agencyHead = $_POST['agencyHead'];
        $_grant = $_POST['_grant'];
        $contractOfService = $_POST['contractOfService'];
        $jobOrder = $_POST['jobOrder'];
        $minimumRate = $_POST['minimumRate'];
        $maximumRate = $_POST['maximumRate'];
        $projects = $_POST['projects'];
        $tallyRangeA = $_POST['tallyRangeA'];
        $tallyRangeB = $_POST['tallyRangeB'];
        $tallyRangeC = $_POST['tallyRangeC'];
        $tallyRangeD = $_POST['tallyRangeD'];
        $tallyRangeE = $_POST['tallyRangeE'];
        $nonGrantReason = $_POST['nonGrantReason'];

        if(isset($_FILES["file"]) && $_FILES["file"]["error"] == 0) {
            $target_dir = "uploads/";

            if (!file_exists($target_dir)) {
                mkdir($target_dir, 0777, true); 
            }

            $file_type = strtolower(pathinfo($_FILES["file"]["name"], PATHINFO_EXTENSION));
            $allowed_types = array("jpg", "jpeg", "png", "pdf");

            if (!in_array($file_type, $allowed_types)) {
                echo "Sorry, only JPG, JPEG, PNG, and PDF files are allowed.";
            } else {
                $target_file = $target_dir . basename($_FILES["file"]["name"]);

                if (move_uploaded_file($_FILES["file"]["tmp_name"], $target_file)) {
                    $filename = $_FILES["file"]["name"];
                    $filesize = number_format($_FILES["file"]["size"] / 1024, 2);
                    $filetype = $_FILES["file"]["type"];
                } else {
                    echo "Error occurred while uploading the file.";
                }
            }
            } else {
                echo "Error: " . $_FILES["file"]["error"];
        }

        $result = mysqli_query($db_conn, "INSERT INTO responses (submitName, designation, contactNumber, email, _year, category, department, agency, university, nameGOCC, nameLWD, provinceLGU, cityMunicipalLGU, nameSUC, nameOthers, agencyHead, _grant, contractOfService, jobOrder, minimumRate, maximumRate, projects, tallyRangeA, tallyRangeB, tallyRangeC, tallyRangeD, tallyRangeE, nonGrantReason, filename, filesize, filetype) 
        VALUES('$submitName', '$designation', '$contactNumber', '$email', '$_year', '$category', '$department', '$agency', '$university', '$nameGOCC', '$nameLWD', '$provinceLGU', '$cityMunicipalLGU', '$nameSUC', '$nameOthers', '$agencyHead', '$_grant', '$contractOfService', '$jobOrder', '$minimumRate', '$maximumRate', '$projects', '$tallyRangeA', '$tallyRangeB', '$tallyRangeC', '$tallyRangeD', '$tallyRangeE', '$nonGrantReason', '$filename', '$filesize', '$filetype')");

        if ($result) {
            echo json_encode(["success" => "User added successfully"]);
            return;
        } else {
            echo json_encode(["success" => "Please check the user data!"]);
            return;
        }
    break;

}

// Fetch data from your database
$query = "SELECT * FROM your_table";
$result = $pdo->query($query);

// Convert data to JSON format
$data = $result->fetchAll(PDO::FETCH_ASSOC);
echo json_encode($data);
?>
